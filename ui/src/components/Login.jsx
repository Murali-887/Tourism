import { handleLogin } from "../helpingFunctions"



const Login = ({setUser, setMessage, setColor}) => {
  return (
    <main>
      <form onSubmit={e => handleLogin(e, setUser, setMessage, setColor)}>
        <table>
          <tbody>
            <tr>
              <td>Email: </td>
              <td><input type="email" name="email" id="email" /></td>
            </tr>
            <tr>
              <td>Password: </td>
              <td><input type="password" name="password" id="password" /></td>
            </tr>
            <tr>
            <td colSpan={2}><input type="submit" value="Submit" /></td>
            </tr>
          </tbody>
        </table>
      </form>
    </main>
  )
}

export default Login
