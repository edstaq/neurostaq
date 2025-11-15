
// --- HELPERS ---
const getElement = (id) => document.getElementById(id);

const formatAPIDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatLearnedDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');
    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
};

const groupTasksBySubject = (tasks) => {
    return tasks.reduce((acc, task) => {
        const subject = task['Subject Name'];
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(task);
        return acc;
    }, {});
};

const categorizeAndGroupTasks = (data) => {
    const allTasks = data || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const pending = [];
    const todayTasks = [];
    const tomorrowTasks = [];

    allTasks.forEach(task => {
        const taskDate = new Date(task['Repetition Date']);
        taskDate.setHours(0, 0, 0, 0);

        if (taskDate < today && !task['Learned update']) {
            pending.push(task);
        } else if (taskDate.getTime() === today.getTime()) {
            todayTasks.push(task);
        } else if (taskDate.getTime() === tomorrow.getTime()) {
            tomorrowTasks.push(task);
        }
    });

    const sortByRepetition = (a, b) => a['Repetition No.'] - b['Repetition No.'];
    pending.sort((a, b) => a['Repetition No.'] - b['Repetition No.'] || new Date(a['Repetition Date']) - new Date(b['Repetition Date']));
    todayTasks.sort(sortByRepetition);
    tomorrowTasks.sort(sortByRepetition);

    return {
        pending: groupTasksBySubject(pending),
        today: groupTasksBySubject(todayTasks),
        tomorrow: groupTasksBySubject(tomorrowTasks),
    };
};

// --- RENDER FUNCTIONS ---

const createFileChips = (fileNamesStr, fileLinksStr) => {
    if (!fileNamesStr || !fileLinksStr) return '';
    const fileNames = fileNamesStr.split(',').map(name => name.trim());
    const fileLinks = fileLinksStr.split(',').map(link => link.trim());
    if (fileNames.length === 0 || fileNames.length !== fileLinks.length) return '';
    return fileNames.map((name, index) => `<a href="${fileLinks[index]}" class="file-chip" target="_blank" rel="noopener noreferrer">${name}</a>`).join('');
};

const createTaskCard = (item) => {
    const isCompleted = Boolean(item['Learned update']);
    const fileChipsHtml = createFileChips(item['File Name(s)'], item['File Link(s)']);

    return `
        <div class="task-card" data-curve-id="${item['Curve ID']}">
            <div class="task-card-header">
                <h2>${item['Topics Covered']}</h2>
                <div class="repetition-info">
                    <span>${item['Repetition Name']} (Stage: ${item['Repetition No.']})</span>
                </div>
            </div>
            <div class="task-card-body">
                <div class="task-card-details">
                    <p><strong>Rep. Date:</strong> ${formatAPIDate(item['Repetition Date'])}</p>
                    <p><strong>Sess. Date:</strong> ${formatAPIDate(item['Session Date'])}</p>
                    <p><strong>Sess. ID:</strong> ${item['Session ID']}</p>
                    <p><strong>Files:</strong> </p>
                </div>
                <div class="task-card-actions">
                    <button class="mark-learned-btn" data-curve-id="${item['Curve ID']}" ${isCompleted ? 'disabled' : ''}>
                        ${isCompleted ? '✓ Completed' : 'Mark as Learned'}
                    </button>
                </div>
            </div>
            <div class="task-card-files">
                ${fileChipsHtml}
            </div>
        </div>
    `;
};

const createSection = (title, tasksByCategory) => {
    if (!tasksByCategory || Object.keys(tasksByCategory).length === 0) return '';

    let taskCount = 0;
    const subjectGroupsHtml = Object.entries(tasksByCategory).map(([subject, tasks]) => {
        taskCount += tasks.length;
        const taskListHtml = tasks.map(createTaskCard).join('');
        return `
            <div class="subject-group">
                <h4 class="subject-heading">${subject}</h4>
                <div class="task-list">${taskListHtml}</div>
            </div>
        `;
    }).join('');

    if (!subjectGroupsHtml) return '';

    return `
        <details class="task-section" >
            <summary>${title} <span class="task-count">${taskCount}</span></summary>
            <div class="section-content">${subjectGroupsHtml}</div>
        </details>
    `;
};

const renderTrackerData = (categorizedData) => {
    const trackerContainer = getElement('tracker-data');
    if (!trackerContainer) return;
    const fullHtml = 
        createSection('Pending', categorizedData.pending) +
        createSection('Today', categorizedData.today) +
        createSection('Tomorrow', categorizedData.tomorrow);
    trackerContainer.innerHTML = fullHtml || '<div class="tracker-message"><h2>No tasks found.</h2><p>Your learning path is clear for now!</p></div>';
};

const renderStudentDetails = (student) => {
    getElement('student-name').textContent = student['Student Name'] || 'N/A';
    getElement('student-id').textContent = `ID: ${student['Student ID'] || 'N/A'}`;
    getElement('student-guardian').textContent = `Guardian: ${student['Guardian Name'] || 'N/A'}`;
    
    const dashboardBtn = getElement('dashboard-btn');
    const dashboardUrl = student['Dashboard'];

    if (dashboardUrl) {
        dashboardBtn.href = dashboardUrl;
        dashboardBtn.style.display = 'flex';
    } else {
        dashboardBtn.style.display = 'none';
    }
};

const showTrackerMessage = (type, message) => {
    const trackerContainer = getElement('tracker-data');
    if (trackerContainer) {
        trackerContainer.innerHTML = `<div class="tracker-message ${type}">${message}</div>`;
    }
};

// --- GLOBAL DATA MANAGEMENT ---
let allTrackerData = [];
let studentId = null;
let storageKey = null;

// --- EVENT HANDLERS ---

function handleLogout() {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentPassword');
    window.location.href = 'login.html';
}

let curveIdToConfirm = null;
let buttonToUpdate = null;

function handleMarkAsLearned(event) {
    if (event.target.classList.contains('mark-learned-btn') && !event.target.disabled) {
        curveIdToConfirm = event.target.getAttribute('data-curve-id');
        buttonToUpdate = event.target;
        getElement('confirmation-modal').style.display = 'flex';
    }
}

async function confirmAction() {
    // Immediately capture the state into local variables for this specific action
    const curveIdForThisAction = curveIdToConfirm;
    const buttonForThisAction = buttonToUpdate;

    // Hide the modal and clear the global state so it doesn't affect other operations.
    getElement('confirmation-modal').style.display = 'none';
    curveIdToConfirm = null;
    buttonToUpdate = null;

    // If there was no action pending when confirm was clicked, do nothing.
    if (!curveIdForThisAction || !buttonForThisAction) return;

    const originalButtonText = buttonForThisAction.textContent;
    buttonForThisAction.textContent = 'Updating...';
    buttonForThisAction.disabled = true;

    const updateApi = `https://script.google.com/macros/s/AKfycbwt9ScuE5-zr-bjAQHQgq4SkcbNRKmL3q5--ssWk6hURopBAP_V45kzcFvvKAc_97Zt/exec?CurveID=${curveIdForThisAction}`;

    try {
        const response = await fetch(updateApi);
        const result = await response.json();

        if (result.status !== 'success') {
            throw new Error(result.message || 'Failed to update the task.');
        }

        const task = allTrackerData.find(t => t['Curve ID'] === curveIdForThisAction);
        if (task) {
            const learnedDate = formatLearnedDate(new Date());
            task['Learned update'] = learnedDate;
            localStorage.setItem(storageKey, JSON.stringify(allTrackerData));
            buttonForThisAction.textContent = '✓ Completed';

            const card = buttonForThisAction.closest('.task-card');
            if (card) {
                card.classList.add('completed');
            }
        }

    } catch (error) {
        console.error('Update Error:', error);
        showTrackerMessage('error', `<h2>Update Failed</h2><p>${error.message}</p><button onclick="initializeTracker()">Reload</button>`);
        // On failure, restore the specific button that failed.
        buttonForThisAction.textContent = originalButtonText;
        buttonForThisAction.disabled = false;
    }
}

function hideModal() {
    getElement('confirmation-modal').style.display = 'none';
    curveIdToConfirm = null;
    buttonToUpdate = null;
}


async function handleChangePassword(event) {
    event.preventDefault();
    const errorMessageElement = getElement('password-error-message');
    errorMessageElement.style.display = 'none'; // Hide by default

    const oldPassword = getElement('old-password').value;
    const newPassword = getElement('new-password').value;
    const confirmNewPassword = getElement('confirm-new-password').value;

    if (newPassword !== confirmNewPassword) {
        errorMessageElement.textContent = 'New passwords do not match.';
        errorMessageElement.style.display = 'block';
        return;
    }

    const saveButton = getElement('save-password-btn');
    saveButton.textContent = 'Saving...';
    saveButton.disabled = true;

    const changePasswordApi = `https://script.google.com/macros/s/AKfycby9cOtD_w6OHRRmMytKZGYJSXIjHHVGlO0HAUIN0bGeKpOmGcgKPe-E6lsy5BPqx3Bi/exec?studentId=${studentId}&oldPassword=${oldPassword}&newPassword=${newPassword}`;

    try {
        const response = await fetch(changePasswordApi);
        const result = await response.json();
        

        if (result["success"]===true) {
            localStorage.setItem('studentPassword', newPassword);
            alert('Password changed successfully!');
            
            getElement('change-password-modal').style.display = 'none';
            getElement('change-password-form').reset();
        } else {
            throw new Error(result.message || 'Failed to change password.');
        }
    } catch (error) {
        console.error('Password Change Error:', error);
        errorMessageElement.textContent = error.message;
        errorMessageElement.style.display = 'block';
    } finally {
        saveButton.textContent = 'Save Changes';
        saveButton.disabled = false;
    }
}

// --- INITIALIZATION ---

async function initializeTracker() {
    studentId = localStorage.getItem('studentId');
    if (!studentId) {
        window.location.href = 'login.html';
        return;
    }
    
    storageKey = `trackerData_${studentId}`;
    
    const loadingModal = getElement('loading-modal');
    loadingModal.style.display = 'flex';
    
    const studentDetailsApi = `https://script.google.com/macros/s/AKfycbzq4wpWQ6UBunS0QG7oNrSlxKPrkcQd-vkmb7QtWfxFbzstY1v8nxDApIfvK2UwtL0B/exec?StudentID=${studentId}`;
    const trackerDataApi = `https://script.google.com/macros/s/AKfycbys2pBBtYJUe3ugIWnGTH10yd06m8jHCGlAGhFDBJhsVSrJA60Y2RECh2LZ1i0Ievbc/exec?StudentID=${studentId}`;
    
    try {
        const [studentRes, trackerRes] = await Promise.all([
            fetch(studentDetailsApi),
            fetch(trackerDataApi)
        ]);

        const studentResult = await studentRes.json();
        const trackerResult = await trackerRes.json();
        
        let studentDetails = studentResult.data;
        if (studentDetails && studentDetails.studentDetails) {
            studentDetails = studentDetails.studentDetails;
        }
        if (Array.isArray(studentDetails)) {
            studentDetails = studentDetails[0];
        }
        
        // checking old password and new password
        const studentPassword = localStorage.getItem('studentPassword');
        const apiPassword = studentDetails?.Password;

        if (!apiPassword) {
            console.warn("API did not return password field.");
        } else if (apiPassword != studentPassword) {
                handleLogout();
        }

        

        if (!studentDetails) {
            throw new Error(studentResult.message || 'Failed to fetch student details.');
        }
        renderStudentDetails(studentDetails);

        if (trackerResult.status === 'success' && trackerResult.data) {
            const trackerArray = Object.values(trackerResult.data);

            allTrackerData = trackerArray;
            localStorage.setItem(storageKey, JSON.stringify(allTrackerData));

            if (allTrackerData.length > 0) {
                const categorizedData = categorizeAndGroupTasks(allTrackerData);
                renderTrackerData(categorizedData);
            } else {
                showTrackerMessage('info', '<h2>Coming Soon!</h2><p>Your personalized learning tracker is being prepared and will be available here shortly.</p>');
            }
        } else {
            showTrackerMessage('info', '<h2>Coming Soon!</h2><p>Your personalized learning tracker is being prepared and will be available here shortly.</p>');
        }

    } catch (error) {
        console.error('API Error:', error);
        showTrackerMessage('error', `<h2>Oops! Something went wrong.</h2><p>${error.message}</p><button onclick="initializeTracker()">Try Again</button>`);
    } finally {
        loadingModal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTracker();

    const logoutBtn = getElement('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const trackerData = getElement('tracker-data');
    if (trackerData) {
        trackerData.addEventListener('click', handleMarkAsLearned);
    }

    const confirmBtn = getElement('confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmAction);
    }

    const cancelBtn = getElement('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideModal);
    }

    const changePasswordBtn = getElement('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            const modal = getElement('change-password-modal');
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }

    const cancelPasswordBtn = getElement('cancel-password-btn');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', () => {
            const modal = getElement('change-password-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            const form = getElement('change-password-form');
            if(form) {
                form.reset();
            }
            const errorMessageElement = getElement('password-error-message');
            if (errorMessageElement) {
                errorMessageElement.style.display = 'none';
            }
        });
    }

    const changePasswordForm = getElement('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }

    const appContainer = document.querySelector('.app-container');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebarCloseBtn = document.querySelector('.sidebar-close-btn');

    if (sidebarToggleBtn && appContainer) {
        sidebarToggleBtn.addEventListener('click', () => appContainer.classList.toggle('sidebar-open'));
    }
    if (sidebarCloseBtn && appContainer) {
        sidebarCloseBtn.addEventListener('click', () => appContainer.classList.remove('sidebar-open'));
    }
});
