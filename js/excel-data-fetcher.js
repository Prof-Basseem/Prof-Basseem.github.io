/**
 * Automatic Excel/Google Sheets Data Fetcher for Lab Members
 * This module fetches student data automatically from Google Sheets and updates the page
 */

class ExcelDataFetcher {
    constructor() {
        this.sheetUrl = null;
        this.apiKey = null;
        this.sheetId = null;
        this.range = 'A:Z'; // Default range to fetch all columns
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
    }

    /**
     * Initialize with Google Sheets configuration
     * @param {string} sheetUrl - Google Sheets sharing URL
     * @param {string} apiKey - Google Sheets API key (optional for public sheets)
     */
    initialize(sheetUrl, apiKey = null) {
        this.sheetUrl = sheetUrl;
        this.apiKey = apiKey;
        this.sheetId = this.extractSheetId(sheetUrl);
        
        if (!this.sheetId) {
            throw new Error('Invalid Google Sheets URL');
        }
        
        console.log('ExcelDataFetcher initialized with Sheet ID:', this.sheetId);
    }

    /**
     * Extract Google Sheets ID from various URL formats
     */
    extractSheetId(url) {
        const patterns = [
            /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
            /key=([a-zA-Z0-9-_]+)/,
            /id=([a-zA-Z0-9-_]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        
        return null;
    }

    /**
     * Build Google Sheets API URL for fetching data
     */
    buildApiUrl(range = this.range) {
        // Try public CSV export first (no API key needed)
        const csvUrl = `https://docs.google.com/spreadsheets/d/${this.sheetId}/export?format=csv&gid=0`;
        
        // If API key is provided, use the official API
        if (this.apiKey) {
            return `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}?key=${this.apiKey}`;
        }
        
        return csvUrl;
    }

    /**
     * Fetch data from Google Sheets
     */
    async fetchSheetData() {
        const cacheKey = `sheet_${this.sheetId}`;
        const cached = this.cache.get(cacheKey);
        
        // Check cache first
        if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
            console.log('Using cached sheet data');
            return cached.data;
        }

        try {
            console.log('Fetching fresh data from Google Sheets...');
            
            // Try CSV export first (works for public sheets)
            const csvUrl = `https://docs.google.com/spreadsheets/d/${this.sheetId}/export?format=csv&gid=0`;
            
            const response = await fetch(csvUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/csv',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const csvText = await response.text();
            const data = this.parseCsvData(csvText);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            console.log('Successfully fetched', data.length, 'rows from Google Sheets');
            return data;
            
        } catch (error) {
            console.error('Error fetching sheet data:', error);
            
            // Try alternative method with CORS proxy
            try {
                return await this.fetchWithProxy();
            } catch (proxyError) {
                console.error('Proxy fetch also failed:', proxyError);
                throw new Error('Unable to fetch data from Google Sheets. Please check sharing permissions.');
            }
        }
    }

    /**
     * Alternative fetch method using CORS proxy
     */
    async fetchWithProxy() {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const csvUrl = `https://docs.google.com/spreadsheets/d/${this.sheetId}/export?format=csv&gid=0`;
        const proxiedUrl = proxyUrl + encodeURIComponent(csvUrl);

        const response = await fetch(proxiedUrl);
        const data = await response.json();
        
        if (data.contents) {
            return this.parseCsvData(data.contents);
        } else {
            throw new Error('No data received from proxy');
        }
    }

    /**
     * Parse CSV data into structured format
     */
    parseCsvData(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = this.parseCsvLine(lines[0]);
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCsvLine(lines[i]);
            if (values.length === 0 || values.every(v => !v.trim())) continue;

            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            rows.push(row);
        }

        return rows;
    }

    /**
     * Parse a single CSV line handling quoted values
     */
    parseCsvLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    /**
     * Map sheet columns to student data structure
     */
    mapSheetDataToStudents(sheetData) {
        return sheetData.map(row => {
            return {
                timestamp: row['الطابع الزمني'] || row['Timestamp'] || '',
                fullName: row['الاسم الكامل'] || row['Full Name'] || '',
                englishName: row['الاسم باللغة الإنجليزية'] || row['English Name'] || '',
                position: row['المنصب الحالي'] || row['Current Position'] || '',
                workplace: row['مكان العمل'] || row['Workplace'] || '',
                profileImage: row['رفع صورة شخصية'] || row['Profile Image'] || '',
                phone: row['رقم الهاتف'] || row['Phone Number'] || '',
                email: row['البريد الإلكتروني'] || row['Email'] || '',
                linkedin: row['LinkedIn'] || '',
                degree: row['الدرجة العلمية'] || row['Degree'] || '',
                department: row['القسم'] || row['Department'] || '',
                researchTitleArabic: row['عنوان البحث (باللغة العربية)'] || row['Research Title (Arabic)'] || '',
                researchTitleEnglish: row['عنوان البحث (باللغة الإنجليزية)'] || row['Research Title (English)'] || '',
                researchProgress: row['تقدم البحث'] || row['Research Progress'] || '',
                experimentStatus: row['حالة التجارب'] || row['Experiment Status'] || '',
                challenges: row['التحديات'] || row['Challenges'] || '',
                supervisorContact: row['التواصل مع المشرف'] || row['Supervisor Contact'] || '',
                contactMethod: row['طريقة التواصل المفضلة'] || row['Preferred Contact Method'] || '',
                supervisionQuality: row['جودة الإشراف'] || row['Supervision Quality'] || '',
                suggestions: row['الاقتراحات'] || row['Suggestions'] || '',
                additionalComments: row['تعليقات إضافية'] || row['Additional Comments'] || ''
            };
        });
    }

    /**
     * Generate lab members page content automatically
     */
    async generateLabMembersContent() {
        try {
            const sheetData = await this.fetchSheetData();
            const students = this.mapSheetDataToStudents(sheetData);
            
            const phdStudents = students.filter(s => 
                s.degree.toLowerCase().includes('phd') || 
                s.degree.toLowerCase().includes('دكتوراه')
            );
            
            const mastersStudents = students.filter(s => 
                s.degree.toLowerCase().includes('master') || 
                s.degree.toLowerCase().includes('ماجستير')
            );

            return {
                students,
                phdStudents,
                mastersStudents,
                totalCount: students.length,
                responseCount: students.length,
                lastUpdated: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Error generating lab members content:', error);
            throw error;
        }
    }

    /**
     * Update the lab members page with fresh data
     */
    async updateLabMembersPage() {
        try {
            const data = await this.generateLabMembersContent();
            
            // Update PhD students section
            this.updateStudentSection('phd-students-container', data.phdStudents, 'Ph.D.');
            
            // Update Masters students section
            this.updateStudentSection('masters-students-container', data.mastersStudents, 'Master\'s');
            
            // Update survey statistics
            this.updateSurveyStatistics(data.totalCount, data.responseCount);
            
            // Show success message
            this.showUpdateNotification('success', `Successfully updated ${data.totalCount} student profiles from Google Sheets`);
            
            return data;
            
        } catch (error) {
            console.error('Error updating lab members page:', error);
            this.showUpdateNotification('error', 'Failed to update from Google Sheets: ' + error.message);
            throw error;
        }
    }

    /**
     * Update a specific student section
     */
    updateStudentSection(containerId, students, degree) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = students.map(student => 
            this.createStudentCard(student, degree)
        ).join('');

        // Initialize enhanced image loading for new images
        if (window.imageLoader) {
            setTimeout(() => {
                window.imageLoader.initializeGoogleDriveImages();
            }, 100);
        }
    }

    /**
     * Create HTML for a student card
     */
    createStudentCard(student, degree) {
        const degreeClass = degree === 'Ph.D.' ? 'primary' : 'success';
        const avatarBg = degree === 'Ph.D.' ? '667eea' : '28a745';
        const colSize = degree === 'Ph.D.' ? '6' : '4';
        
        return `
        <div class="col-lg-${colSize} col-md-${degree === 'Ph.D.' ? '12' : '6'} mb-4">
            <div class="card custom-card h-100">
                <div class="card-body text-center">
                    <div class="member-photo mb-3">
                        <img src="${student.profileImage || 'assets/img/default-avatar.jpg'}" 
                             alt="${student.fullName}" 
                             class="member-img"
                             data-fallback="https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=${avatarBg}&color=ffffff&size=150&bold=true">
                    </div>
                    
                    <h5 class="card-title mb-3">${student.fullName}</h5>
                    ${student.englishName ? `<h6 class="text-muted mb-2">${student.englishName}</h6>` : ''}
                    
                    <div class="degree-badge">
                        <span class="badge bg-${degreeClass} mb-3">${degree} Student</span>
                    </div>
                    
                    ${student.position || student.workplace || student.email || student.phone ? `
                    <div class="contact-info mb-3">
                        ${student.position ? `<p class="small mb-1"><i class="fas fa-briefcase me-2"></i>${student.position}</p>` : ''}
                        ${student.workplace ? `<p class="small mb-1"><i class="fas fa-building me-2"></i>${student.workplace}</p>` : ''}
                        ${student.email ? `<p class="small mb-1"><i class="fas fa-envelope me-2"></i>${student.email}</p>` : ''}
                        ${student.phone ? `<p class="small mb-1"><i class="fas fa-phone me-2"></i>${student.phone}</p>` : ''}
                    </div>
                    ` : ''}
                    
                    <div class="thesis-info text-start">
                        ${student.researchTitleArabic ? `
                        <h6 class="fw-bold mb-2">عنوان البحث (باللغة العربية):</h6>
                        <p class="text-muted mb-3" style="font-size: 0.9rem; direction: rtl;">
                            ${student.researchTitleArabic}
                        </p>
                        ` : ''}
                        
                        ${student.researchTitleEnglish ? `
                        <h6 class="fw-bold mb-2">Research Title (English):</h6>
                        <p class="text-muted" style="font-size: 0.9rem; font-style: italic;">
                            ${student.researchTitleEnglish}
                        </p>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Update survey statistics
     */
    updateSurveyStatistics(totalStudents, responseCount) {
        const completionRate = totalStudents > 0 ? ((responseCount / totalStudents) * 100).toFixed(1) : 0;
        const pendingCount = totalStudents - responseCount;
        
        // Update stats
        const statsContainer = document.querySelector('.survey-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="col-md-4 mb-3">
                    <div class="stat-item">
                        <h4 class="text-success mb-2">${responseCount}</h4>
                        <p class="small text-muted">Responses Received</p>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="stat-item">
                        <h4 class="text-warning mb-2">${pendingCount}</h4>
                        <p class="small text-muted">Pending Responses</p>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="stat-item">
                        <h4 class="text-info mb-2">${totalStudents}</h4>
                        <p class="small text-muted">Total Students</p>
                    </div>
                </div>
            `;
        }

        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${completionRate}%`;
            progressBar.setAttribute('aria-valuenow', completionRate);
        }

        // Update last updated text
        const statusText = document.querySelector('.survey-status-text');
        if (statusText) {
            const lastUpdated = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            statusText.innerHTML = `
                <strong>Last Updated:</strong> ${lastUpdated} | 
                <strong>Survey Completion Rate:</strong> ${completionRate}%
            `;
        }
    }

    /**
     * Show update notification
     */
    showUpdateNotification(type, message) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
        
        const notification = document.createElement('div');
        notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        notification.innerHTML = `
            <i class="fas ${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global instance
const excelDataFetcher = new ExcelDataFetcher();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ExcelDataFetcher = ExcelDataFetcher;
    window.excelDataFetcher = excelDataFetcher;
}
