import axios from "axios";

export async function handleLogin(e, setUser, setMessage, setColor) {
    e.preventDefault();
    const body = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    const data = await axios.post('http://localhost:4201/api/v1/users//login', {...body}, {
        headers: {
            contentType: 'application/json',
            Accept: 'application/json',
        },
    })
    if(data.status === 200) {
        setColor('lightgreen');
        setMessage('Login successful');
        console.log(data.data.data)
        setUser(data.data.data);
    } else {
        setColor('red');
        setMessage(data.data.message);
    }
}

export async function handleSignup(e, setMessage) {
    e.preventDefault();
    const body = {
        name: e.target.name.value,
        email: e.target.email.value,
        role: e.target.role?.value || 'user',
        password: e.target.password.value,
        passwordConfirm: e.target.passwordConfirm.value
    };
    try {
    const data = await axios.post('http://localhost:4201/api/v1/users/signup', {...body}, {
        headers: {
            contentType: 'multipart/form-data',
            Accept: 'multipart/form-data'
        }
    })
    if(data.status === 201) {
        setMessage('SignUp successful. You can login now')
    }
    }
    catch(e) {
        setMessage(e.response.data);
    }
}

export async function handleLogout(setUser, setMessage) {
    try {
        const data = await axios.get('http://localhost:4201/api/v1/users/logout');
        if(data.status === 200) {
            setUser(null);
            setMessage('Logout Successful')
        }
    } catch (e) {
        setMessage('Error');
        console.log(e)
    }

}