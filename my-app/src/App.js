import './App.css';
// import './data.json';
import React, { Component } from "react";
import { firestore } from "./firebase";
import { addDoc, collection, getDocs } from "@firebase/firestore";

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      birthday: '',
      allBirthdays: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.fetchBirthdays = this.fetchBirthdays.bind(this);

    this.birthdayRef = React.createRef();
  }

  async componentDidMount() {
    await this.fetchBirthdays();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  async fetchBirthdays() {
    const ref = collection(firestore, "birthdays");
    const querySnapshot = await getDocs(ref);
    const birthdays = [];
    querySnapshot.forEach((doc) => {
      const birthdayData = doc.data();
      birthdays.push(birthdayData);
    });
    this.setState({ allBirthdays: birthdays });
  }

  handleFormSubmit = async(e) => {
    e.preventDefault();
    const { name, birthday } = this.state;

    console.log("Name:", name);
    console.log("Birthday:", birthday);

    if (!name || !birthday ) {
      alert("Enter both name and birthday");
      return;
    }

    let data = {
      name: name,
      birthday: birthday}

    const ref = collection(firestore, "birthdays")
    try {
      addDoc(ref, data)
      await this.fetchBirthdays();
    } catch (e) {
      console.log(e);
    }
  };

  render() {

    const { allBirthdays, name, birthday } = this.state;
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const nextMonth = (currentDate.getMonth() + 2).toString();

    return (
        <header>
        <div>
          <h3>Birthdays This Month:</h3>
          { allBirthdays.length > 0 ? (
            allBirthdays.map((item, index ) => {
              const birthMonth = parseInt(item.birthday.split('-')[1])
            if (birthMonth === parseInt(currentMonth)) {
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

          <h4>Birthdays Next Month:</h4>
          { allBirthdays.length > 0 ? (
            allBirthdays.map((item, index ) => {
              const birthMonth = parseInt(item.birthday.split('-')[1])
            if (birthMonth === parseInt(nextMonth)) {
              return (
                <div key={index}>
                  <p>{item.name}'s birthday is on the {item.birthday} </p>
                </div>
              );
            } else {
              return (
                null
              )
             }
            })
          ) : (
            <p>No Birthdays next month</p>
          )}

        </div>

          <form onSubmit={this.handleFormSubmit}>
            <div>
              Name: {" "}
              <input type='text' name="name" value={name} onChange={this.handleChange} required ref={this.birthdayRef} />
            </div>
            <div>
              Birthday: {" "}
              <input name="birthday" type='date' value={birthday} onChange={this.handleChange} required  ref={this.birthdayRef}/>
            </div>
            <button type="submit">Add Birthday</button>
          </form>

          <ul>
            {allBirthdays.map((birthday, index) => (
              <li key={index}>
                {birthday.name}: {birthday.birthday}
              </li>
            ))}
          </ul>

        </header>
    );
  }
}


// export default App;
