import { handleSignup } from "../helpingFunctions"

const SignUp = ({user, setMessage}) => {
  return (
    <main>
    <form onSubmit={e => handleSignup(e, setMessage)}>
        <table>
        <tbody>
            <tr>
                <td><label htmlFor="name">Username: </label></td>
                <td><input type="text" name="name" id="name" required /></td>
            </tr>
            <tr>
                <td><label htmlFor="email">Email: </label></td>
                <td><input type="email" name="email" id="email" required /></td>
            </tr>
            {
                user && user.role === 'admin' ?
                <tr>
                    <td><label htmlFor="role">Role: </label></td>
                    <td>
                        <select name="role" id="role" defaultValue='user'>
                        <option value="admin">Admin</option>
                        <option value="lead-guide">Lead Guide</option>
                        <option value="guide">Guide</option>
                        <option value="user">User</option>
                        </select>
                    </td>
                </tr>
                :null
            }
            <tr>
                <td>Password</td>
                <td><input type="password" name="password" id="password" required/></td>
            </tr>
            <tr>
                <td>Confirm Password</td>
                <td><input type="password" name="passwordConfirm" id="passwordConfirm" required /></td>
            </tr>
            <tr>
                <td>photo</td>
                <td><input type="file" name="photo" id="photo" /></td>
            </tr>
            <tr>
                <td><input type="submit" value="Submit" /></td>
            </tr>
        </tbody>
        </table>
        </form>
    </main>
  )
}

export default SignUp
