function showDirectory(data) {
    data = data['contents']
    document.getElementById('directory-data').innerHTML = ''
    const isTrash = getCurrentPath().startsWith('/trash')

    let html = ''

    // Step 2: Sort the array based on the 'date' values
    let entries = Object.entries(data);
    let folders = entries.filter(([key, value]) => value.type === 'folder');
    let files = entries.filter(([key, value]) => value.type === 'file');

    folders.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));
    files.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));

    for (const [key, item] of folders) {
        if (item.type === 'folder') {
            html += `<tr data-path="${item.path}" data-id="${item.id}" class="body-tr folder-tr"><td><div class="td-align"><img src="static/assets/folder-solid-icon.svg">${item.name}</div></td><td><div class="td-align"></div></td><td><div class="td-align"><a data-id="${item.id}" class="more-btn"><img src="static/assets/more-icon.svg" class="rotate-90"></a></div></td></tr>`

            if (isTrash) {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="restore-${item.id}" data-path="${item.path}"><img src="static/assets/load-icon.svg"> Restore</div><hr><div id="delete-${item.id}" data-path="${item.path}"><img src="static/assets/trash-icon.svg"> Delete</div></div>`
            }
            else {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="rename-${item.id}"><img src="static/assets/pencil-icon.svg"> Rename</div><hr><div id="trash-${item.id}"><img src="static/assets/trash-icon.svg"> Trash</div><hr><div id="folder-share-${item.id}"><img src="static/assets/share-icon.svg"> Share</div></div>`
            }
        }
    }

    for (const [key, item] of files) {
        if (item.type === 'file') {
            const size = convertBytes(item.size)
            html += `<tr data-path="${item.path}" data-id="${item.id}" data-name="${item.name}" class="body-tr file-tr"><td><div class="td-align"><img src="static/assets/file-icon.svg">${item.name}</div></td><td><div class="td-align">${size}</div></td><td><div class="td-align"><a data-id="${item.id}" class="more-btn"><img src="static/assets/more-icon.svg" class="rotate-90"></a></div></td></tr>`

            if (isTrash) {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="restore-${item.id}" data-path="${item.path}"><img src="static/assets/load-icon.svg"> Restore</div><hr><div id="delete-${item.id}" data-path="${item.path}"><img src="static/assets/trash-icon.svg"> Delete</div></div>`
            }
            else {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="rename-${item.id}"><img src="static/assets/pencil-icon.svg"> Rename</div><hr><div id="trash-${item.id}"><img src="static/assets/trash-icon.svg"> Trash</div><hr><div id="share-${item.id}"><img src="static/assets/share-icon.svg"> Share</div></div>`
            }
        }
    }
    document.getElementById('directory-data').innerHTML = html

    if (!isTrash) {
        document.querySelectorAll('.folder-tr').forEach(div => {
            div.ondblclick = openFolder;
        });
        document.querySelectorAll('.file-tr').forEach(div => {
            div.ondblclick = openFile;
        });
    }

    document.querySelectorAll('.more-btn').forEach(div => {
        div.addEventListener('click', function (event) {
            event.preventDefault();
            openMoreButton(div)
        });
    });
}

document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.getElementById('file-search').value;
    console.log(query)
    if (query === '') {
        alert('Search field is empty');
        return;
    }
    const path = '/?path=/search_' + encodeURI(query);
    console.log(path)
    window.location = path;
});

// Loading Main Page

document.addEventListener('DOMContentLoaded', function () {
    const inputs = ['new-folder-name', 'rename-name', 'file-search']
    for (let i = 0; i < inputs.length; i++) {
        document.getElementById(inputs[i]).addEventListener('input', validateInput);
    }

    if (getCurrentPath().includes('/share_')) {
        getCurrentDirectory()
    } else {
        if (getPassword() === null) {
            document.getElementById('bg-blur').style.zIndex = '2';
            document.getElementById('bg-blur').style.opacity = '0.1';

            document.getElementById('get-password').style.zIndex = '3';
            document.getElementById('get-password').style.opacity = '1';
        } else {
            getCurrentDirectory()
        }
    }

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check local storage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        updateIcon(true);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon(isDark);
        });
    }

    function updateIcon(isDark) {
        if (!themeIcon) return;
        if (isDark) {
            // Sun Icon (Material Design Wb_sunny)
            themeIcon.innerHTML = '<path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280Zm0-40q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47ZM480-80q-17 0-28.5-11.5T440-120v-80q0-17 11.5-28.5T480-240q17 0 28.5 11.5T520-200v80q0 17-11.5 28.5T480-80Zm-360-360q-17 0-28.5-11.5T80-480q0-17 11.5-28.5T120-520h80q17 0 28.5 11.5T240-480q0 17-11.5 28.5T200-440h-80Zm720 0q-17 0-28.5-11.5T800-480q0-17 11.5-28.5T840-520h80q17 0 28.5 11.5T960-480q0 17-11.5 28.5T920-440h-80ZM480-720q-17 0-28.5-11.5T440-760v-80q0-17 11.5-28.5T480-880q17 0 28.5 11.5T520-840v80q0 17-11.5 28.5T480-720ZM224-680q-12 0-23-6t-17-18q-11-12-5.5-28t23.5-22l56-56q12-12 28-12.5t28 12.5q12 12 12.5 28.5T314-754l-56 56q-6 6-17 12t-17 6Zm512 512q-12 0-23-6t-17-18q-11-12-5.5-28t23.5-22l56-56q12-12 28-12.5t28 12.5q12 12 12.5 28.5T726-242l-56 56q-6 6-17 12t-17 6ZM224-224q-12 0-23-6t-17-18q-11-12-5.5-28t23.5-22l56-56q12-12 28-12.5t28 12.5q12 12 12.5 28.5T314-298l-56 56q-6 6-17 12t-17 6Zm512-512q-12 0-23-6t-17-18q-11-12-5.5-28t23.5-22l56-56q12-12 28-12.5t28 12.5q12 12 12.5 28.5T726-754l-56 56q-6 6-17 12t-17 6ZM480-480Z"/>';
        } else {
            // Moon Icon (Original)
            themeIcon.innerHTML = '<path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/>';
        }
    }


    // Sidebar Toggle Logic
    const sidebarBtn = document.getElementById('sidebar-toggle-btn');
    const container = document.querySelector('.container');

    // Check local storage for sidebar state
    if (localStorage.getItem('sidebar') === 'collapsed') {
        container.classList.add('sidebar-collapsed');
    }

    if (sidebarBtn) {
        sidebarBtn.addEventListener('click', () => {
            container.classList.toggle('sidebar-collapsed');
            const isCollapsed = container.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebar', isCollapsed ? 'collapsed' : 'expanded');
        });
    }
});
