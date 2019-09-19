import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {

  state = {
    isConnected:false,
    id:null,
    peeps:[],
    message:'',
    room_message:[]
  }
  socket = null

  componentWillMount(){

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })
    this.socket.on('pong!',()=>{
      console.log('the server answered!')
    })
    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })
    this.socket.on('pong!',(additionalStuff)=>{
      console.log('server answered!', additionalStuff)
    })
    this.socket.on('peeps',(peeps)=>{
      console.log('server answered!', this.setState({peeps})
      )
    })
    this.socket.on('new connection',(newId)=>{
      const peeps = [...this.state.peeps,newId]
      this.setState({peeps})

    })
    /** this will be useful way, way later **/
    this.socket.on('room', old_messages => this.setState({room_message:old_messages}))
    this.socket.on('youare',(answer)=>{
     
      this.setState({id:answer.id})
    })
    this.socket.on('next',(message_from_server)=>console.log('message_from_server==>',message_from_server))
  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }
  onClick =(e)=>{
    e.preventDefault();
    let message ={
      id:this.state.id,
      name:'Baseeeeeeeeeel',
      text:this.state.message
    }
    this.socket.emit('message',message)
    // this.socket.on('room_message',(room_message)=>{
    //   console.log('server answered!'
    //   )
    // })
  }
  render() {
    return (
      <div className="App">
        <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
        <button onClick={()=>this.socket.emit('ping!')}>ping</button>
        <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button>
        
        <input value={this.state.message} onChange={(e)=>{
              e.preventDefault();

          this.setState({message:e.target.value})}} ></input>
        <button onClick={(e)=>this.onClick(e)} >Chatting</button>
    
          {
            this.state.room_message.map(m=><div>
              <h3 >{m.name} :</h3>
                <p > {m.text}</p> 
              </div>
              )
          }
      </div>
    );
  }
}

export default App;