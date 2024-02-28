import './App.css';
import React, { Component } from "react";

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saveData: JSON.parse(localStorage.getItem('userData')) || [],
      name: '',
      birthday: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    const savedData = JSON.parse(localStorage.getItem('userData'));
    if (savedData) {
      this.setState({ savedData: savedData });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  saveData = (e) => {
    e.preventDefault();
    const { name, birthday } = this.state;
    const newData = { name, birthday };
    const updatedData = [...this.state.saveData, newData];

    localStorage.setItem('userData', JSON.stringify(updatedData));

    this.setState({ saveData: updatedData, name: '', birthday: '' });
  };


  render() {

    const { saveData, name, birthday } = this.state;
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    // const currentDay = currentDate.getDay();

    return (
        <header>
        <div>
          {/* <h2>Birthdays Today: </h2> */}
            {/* {savedData && savedData.birthday === currentDay && currentMonth && (
              <div>
                <p> {savedData.name} birthday is today</p>
              </div>
            )} */}
        </div>
        <div>
          <h3>Birthdays This Month:</h3>
          { saveData.length > 0 ? (
            saveData.map((item, index ) => {
            if (item.birthday.split('-')[1] === currentMonth) {
              return (
                <div key={index}>
                  <p>Name: {item.name} </p>
                  <p>{item.birthday} </p>
                </div>
              );
            } else {
              return (
                null
              )
             }
            })
          ) : (
            <p>No Birthdays this month</p>
          )}
        </div>
          <form onSubmit={this.saveData}>
            <div>
            Name: {" "}
            <input name="name" value={this.state.name} onChange={this.handleChange} />
            </div>
            <div>
              Birthday: {" "}
              <input name="birthday" type='date' value={this.state.birthday} onChange={this.handleChange} />
            </div>
            <button type="submit">Add Birthday</button>
          </form>

          {/* {savedData && (
            <div>
              <p>Name: {savedData.name}</p>
              <p>Birthday: {savedData.birthday}</p>
            </div>
          )} */}

        </header>
    );
  }
}


// export default App;
