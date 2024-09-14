import React, { useEffect, useState } from 'react';
import "./Register.css";
import api from '../../../axios/api';
import { Link } from 'react-router-dom';

const Register = () => {
    const [error, setError] = useState(null);
    const [type, setType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [email, setEmail] = useState("");
    const [province, setProvince] = useState("");
    const [date, setDate] = useState("");
    const [confirmation, setConfirmation] = useState(false);
    const [informativeEmails, setInformativeEmails] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchTypeData = async () => {
            try {
                const response = await api.get('/api/user/region');
                if (isMounted) setType(response.data);
            } catch (err) {
                if (isMounted) setError(err);
            }
        };
        fetchTypeData();

        return () => {
            isMounted = false;
        };
    }, []);

    const optionsSelector = type.map((option) => (
        <option key={option.Id} value={option.Name}>{option.Name}</option>
    ));

    useEffect(() => {
        if (pass && confirmPass && pass !== confirmPass) {
            setError({ message: "Passwords do not match" });
        } else {
            setError(null);
        }
    }, [pass, confirmPass]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (pass === confirmPass) {
                const validEmail = await api.get('/api/user/email', {
                    params: {
                        Email: email
                    }
                });
                if (validEmail.data) {
                    const response = await api.post('/api/user/register', {
                        Name: name,
                        LastName: lastName,
                        Email: email,
                        Region: province,
                        Password: pass,
                        ConfirmPassword: confirmPass,
                        Date: date,
                        InformativeEmails: informativeEmails
                    });
                    setConfirmation(response.data);
                } else {
                    setError({ message: "Email already registered" });
                }
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='registerContent'>
            <form onSubmit={handleSearch} className='form'>
                <h2>Register</h2>
                <label>Nombre:</label>
                <input type="text" name="name" onChange={(e) => setName(e.target.value)} placeholder='Escribe tu nombre' required />

                <label>Apellido:</label>
                <input type="text" name="lastName" onChange={(e) => setLastName(e.target.value)} placeholder='Escribe tu apellido' required />

                <label>Email:</label>
                <input type="email" name="mail" onChange={(e) => setEmail(e.target.value)} placeholder='Escribe tu email' required />

                <label>Fecha de nacimiento:</label>
                <input type="date" name="date" onChange={(e) => setDate(e.target.value)} required />

                <label>Provincia:</label>
                <select name="province" onChange={(e) => setProvince(e.target.value)} placeholder="Selecciona tu provincia" required>
                    {optionsSelector}
                </select>

                <label>Contraseña:</label>
                <input type="password" name="password" onChange={(e) => setPass(e.target.value)} placeholder='Escribe tu contraseña' required />

                <label>Confirmar contraseña:</label>
                <input type="password" name="confirmPassword" onChange={(e) => setConfirmPass(e.target.value)} placeholder='Repite tu contraseña' required />

                <label>
                    Deseas recibir mails informativos?
                    <input type="checkbox" onChange={(e) => setInformativeEmails(e.target.checked)} />
                </label>

                <button type='submit' disabled={loading}>
                    {loading ? "Registering..." : "Registrarse"}
                </button>
            </form>
            <div>
                {loading ? <div className="loader"></div> : 
                confirmation ? 
                <div>Usuario registrado correctamente - <Link to='/Login'>Logeate</Link></div> 
                : 
                <p>el usuario no se pudo registrar</p>}
                {error && <p>Error al registrar al usuario: {error.message}</p>}
            </div>
        </div>
    );
};

export default Register;
