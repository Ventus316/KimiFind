const currentUserStr = localStorage.getItem('kimiUser');
const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
if (!currentUser || currentUser.role !== 'admin') {
    alert('權限不足！請以管理員身分登入。');
    window.location.href = 'login.html';
}