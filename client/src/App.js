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

  const jsonp = async () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://localhost:9000/user?callback_name=jsonpCallback'
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  const fetchUser = async () => {
    const response = await axios.get('http://localhost:9000/user')
    console.log('fetchUser', response.data);
  }

  return (
    <div className="App">
      <button onClick={simpleGet}>simple get</button>
      <button onClick={simplePost}>simple post</button>
      <button onClick={complexPost}>complex post</button>
      <button onClick={complexPut}>complex put</button>
      <button onClick={jsonp}>jsonp</button>
      <button onClick={fetchUser}>fetch user</button>
    </div>
  );
}

export default App;
