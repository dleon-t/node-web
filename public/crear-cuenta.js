document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, usuario, password })
        });

        const result = await response.json();
        const messageElement = document.getElementById('message');

        if (response.ok) {
            messageElement.textContent = 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.';
            messageElement.style.color = 'green';
        } else {
            messageElement.textContent = `Error: ${result.message}`;
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
