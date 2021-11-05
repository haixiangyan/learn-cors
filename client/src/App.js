import axios from 'axios';

function App() {
  const simpleGet = async () => {
    const response = await axios.get('http://localhost:9000')
    console.log('simpleGet', response.data);
  }

  const simplePost = async () => {
    const response = await axios.post('http://localhost:9000', {
      name: 'Jack',
      password: '123',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    console.log('simplePost', response.data);
  }

  const complexPost = async () => {
    const response = await axios.post('http://localhost:9000', {
      name: 'Jack',
      password: '123',
    })
    console.log('complexPost', response.data);
  }

  const complexPut = async () => {
    const response = await axios.put('http://localhost:9000', {
      name: 'Jack',
      password: '123',
    })
    console.log('complexPost', response.data);
  }

  return (
    <div className="App">
      <button onClick={simpleGet}>simple get</button>
      <button onClick={simplePost}>simple post</button>
      <button onClick={complexPost}>complex post</button>
      <button onClick={complexPut}>complex put</button>
    </div>
  );
}

export default App;
