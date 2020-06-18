//Daniel Garcia Sampar e Rodrigo Zimmerman

import React, {useEffect, useState} from 'react';
import api from './service/api';

import GlobalStyle from './global';
import {Container, Table, Form, Strong} from './styles'

function App() {
  const [employees, setEmployees] = useState([]);

  const[isEditing, setIsEditing] = useState(false);

  const[id, setId] = useState('');
  const[name, setName] = useState('');
  const[salary, setSalary] = useState('');
  const[age, setAge] = useState('');
  const[profile_image, setProfileImage] = useState('');


  useEffect(() => {
    loadEmployees();
  }, [])

  async function loadEmployees(){
    const response = await api.get('/employees');
    //devido a estrutura do dado retornado tive q usar 2 .data
    setEmployees(response.data.data)
  }

  async function handleEdit(data){
    setId(data.id);
    setName(data.employee_name);
    setSalary(data.employee_salary);
    setAge(data.employee_age);
    setProfileImage(data.profile_image);
    setIsEditing(true);

  }

  async function handleUpdate(e){
    e.preventDefault();
    await api.put(`/update/${id}`, {
      name,
      salary,
      age,
      profile_image
    });
    setId('');
    loadEmployees();
  }

  async function handleDelete(id) {
    await api.delete(`/delete/${id}`);
    setEmployees(employees.filter(employee => employee.id !== id))
}

  async function handleSubmit(e){
    e.preventDefault();
    const response = await api.post('/create', {
      name,
      salary,
      age,
      profile_image
    });
    const newData = {
      id: response.data.data.id,
      employee_name: response.data.data.name,
      employee_salary: response.data.data.salary,
      employee_age: response.data.data.age,
      profile_image: response.data.data.profile_image,
    }
    setEmployees([...employees, newData]);
    //loadEmployees();
  }

  function handleCancel(){
    setId('');
    setName('');
    setSalary('');
    setAge('');
    setProfileImage('');
  }

  let options = [];
  for(let i =0; i <= 150; i++){
    options.push(<option value={i} key={i}>{i}</option>)
  }

  return (
    <Container>
      <GlobalStyle/>
        
          <Form onSubmit={handleSubmit}>
            <Strong>Adicionando novo Empregado</Strong>
            <label>Nome:</label>
            <input className="string" id="name" required value={name} onChange={e => setName(e.target.value)}></input>
            <label>Salario:</label>
            <input className="number" id="salary" required value={salary} onChange={e => setSalary(e.target.value)}></input>
            <label>Idade:</label>
            <select onChange={e => setAge(e.target.value)}>
              <option value={age}>{age}</option>
              {options}

            </select>
            <label>Avatar:</label>
            <input className="string" id="avatar" value={profile_image} onChange={e => setProfileImage(e.target.value)}></input>
            <div className="buttons">
              <button type="submit">Salvar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
            {isEditing && <button className="edit" onClick={handleUpdate}>Alterar</button>}
          </Form>
        
        <main>
          <Table>
          <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Salário</th>
                <th>Idade</th>
                <th>Avatar</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.id}</td>
                  <td>{employee.employee_name}</td>
                  <td>{employee.employee_salary}</td>
                  <td>{employee.employee_age}</td>
                  <td><img src={employee.profile_image} alt={employee.name}/></td>
                  
                  <td>
                    <button onClick={() => window.confirm(`Deseja deletar o funcionario com id: ${employee.id} e nome ${employee.employee_name}?`)
                                       ? handleDelete(employee.id) : ''}>Excluir</button>
                    <button onClick={() => handleEdit(employee)}>Editar</button>                     
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </main>
    </Container>
  );
}

export default App;
