(function () {
    const btnApply = document.getElementById('apply_changes')
    
    btnApply.addEventListener('click', async (e) => {
        e.preventDefault()
        const usersChanges = []

        const users = document.querySelectorAll('.user_box')
        users.forEach(user => {
            const rtnObj = {
                _id: user.id
            }

            const deleteUser = user.querySelector(`#delete_${user.id}`).checked
            if(deleteUser) {
                rtnObj['deleteUser'] = true
                usersChanges.push(rtnObj)
                return
            }

            const rolesRadio = user.querySelectorAll("input[type=radio]")
            rolesRadio.forEach(radio => {
                if(radio.checked) {
                    rtnObj['role'] = radio.value
                    usersChanges.push(rtnObj)
                    return
                }
            })
        })

        usersChanges.forEach(user => {
            if(user.deleteUser) {
                fetch(`/api/account/${user._id}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => console.log(data))
                return
            }

            if(user.role) {
                fetch(`/api/account/${user._id}/setrole/${user.role}`, { method: 'POST' })
                .then(res => res.json())
                .then(data => console.log(data))
                return
            }
        })

        Swal.fire({
            position: "center",
            title: `Changes applied, see console for more info`,
            showConfirmButton: true,
            timer: 0
        })
    })
})()