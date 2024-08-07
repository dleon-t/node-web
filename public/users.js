// usuarios.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No estás autenticado');
        window.location.href = '/login';
        return;
    }

    async function fetchUsers() {
        const response = await fetch('/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            populateUserTable(users);
        } else {
            alert('Error al obtener usuarios');
        }
    }

    function populateUserTable(users) {
        const tbody = document.getElementById('userTable').querySelector('tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.Id}</td>
                <td>${user.Nombre}</td>
                <td>${user.Usuario}</td>
                <td>
                    <button onclick="editUser(${user.Id})">Editar</button>
                    <button onclick="deleteUser(${user.Id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.editUser = async function(id) {
        const nombre = prompt('Nuevo nombre:');
        const usuario = prompt('Nuevo usuario:');
        
        if (nombre && usuario) {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, nombre, usuario })
            });

            if (response.ok) {
                alert('Usuario actualizado');
                fetchUsers();
            } else {
                alert('Error al actualizar el usuario');
            }
        }
    }

    window.deleteUser = async function(id) {
        const response = await fetch('/api/users', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id })
        });

        if (response.ok) {
            alert('Usuario eliminado');
            fetchUsers();
        } else {
            alert('Error al eliminar el usuario');
        }
    }

    fetchUsers();
});