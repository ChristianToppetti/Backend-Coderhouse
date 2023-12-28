(function () {
    const chatContainer = document.getElementById('chat')
    const formChat = document.getElementById('chat_form')
    const inputMsg = document.getElementById('msg_input')

    const socket = io()

    formChat.addEventListener('submit', async (e) => {
        e.preventDefault()
        const currentUser = await fetch('/api/account/current').json()
        const newMessage = { 
            user: currentUser.first_name, 
            message: inputMsg.value, 
        }
        socket.emit('new-message', newMessage)
        inputMsg.value = ''
        inputMsg.focus()
    })
    
    function updateMessage({user, message}) {
        const div = document.createElement('div')
        div.classList.add('chat_msg')
        div.innerHTML = `<p><strong>${user}:</strong> ${message}</p>`
        chatContainer.appendChild(div)
        chatContainer.scrollTop = chatContainer.scrollHeight
    }
    
    socket.on('update-message', ({user, message}) => {
        updateMessage({user, message})
    })

    socket.emit('send-chat')
})()