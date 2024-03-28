import './App.css';
// import './data.json';
import React, { Component } from "react";
import { firestore } from "./firebase";
import { addDoc, collection, getDocs } from "@firebase/firestore";
// import moment from 'moment';


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
    const nextMonthDate = new Date(currentDate.getFullYear(), currentMonth, 1);
    const monthName = new Intl.DateTimeFormat('en-AU', { month: 'long'}).format(currentDate);
    const nextMonthName = new Intl.DateTimeFormat('en-AU', { month: 'long'}).format(nextMonthDate);

    function getAge(dateString) {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }

    const birthdaysByMonth = {};
    allBirthdays.forEach((birthday) => {
      const month = birthday.birthday.split("-")[1];
      if (!birthdaysByMonth[month]) {
        birthdaysByMonth[month] = [];
      }
      birthdaysByMonth[month].push(birthday);
    });

    const sortedMonth = Object.keys(birthdaysByMonth).sort((a, b) => parseInt(a) - parseInt(b))
    const monthNames = sortedMonth.map(month => {
      const date = new Date(currentDate.getFullYear(), month - 1, 1);
      return new Intl.DateTimeFormat('en-AU', { month: 'long'}).format(date);
    })

    return (
        <header className='body'>
        <div>

          <div className="card">
            <h3>This month: {monthName} </h3>
            { allBirthdays.length > 0 ? (
              allBirthdays.map((item, index ) => {
                const birthMonth = parseInt(item.birthday.split('-')[1])

              if (birthMonth === parseInt(currentMonth)) {
                return (
                  <div key={index}>
                      <ul>
                        <li>
                        <p>{item.name}</p>
                        <p>{new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(item.birthday))} - Age: {getAge(item.birthday)}</p>
                        </li>
                      </ul>
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

          <div className="card">
            <h4>Next month: {nextMonthName}</h4>
            { allBirthdays.length > 0 ? (
              allBirthdays.map((item, index ) => {
                const birthMonth = parseInt(item.birthday.split('-')[1])
              if (birthMonth === parseInt(nextMonth)) {
                return (
                  <div key={index}>
                    <p>{item.name}</p>
                    <p>{new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(item.birthday))} - Age: {getAge(item.birthday)}</p>
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
        </div>




          <div className="all-birthdays-title">
            <h3>All Birthdays</h3>
          </div>
          <div>
            <div className="all-birthdays">
            {monthNames.map((monthName, index) => (
              <div key={index} className='card'>
                <h4>{monthName}</h4>
                  <ul>
                    {birthdaysByMonth[sortedMonth[index]].map((birthday, innerIndex) => (
                      <div className="allbirthdays">
                        <li key={innerIndex}>
                          <p>{birthday.name}</p>
                          <p>{new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(birthday.birthday))} - Age: {getAge(birthday.birthday)}</p>
                        </li>
                      </div>
                    ))}
                  </ul>
                </div>
            ))}
            </div>
          </div>

          <div className="form">
            <form onSubmit={this.handleFormSubmit}>
              <div className="inputs">
                <div className="form-title">
                  <p>Name: {" "}</p>
                  <input type='text' name="name" value={name} onChange={this.handleChange} required ref={this.birthdayRef} className="input"/>
                </div>
                <div className="form-title">
                  <p>Birthday: {" "}</p>
                  <input name="birthday" type='date' value={birthday} onChange={this.handleChange} required  ref={this.birthdayRef} className="input birthday"/>
                </div>
                <div>
                  <button type="submit" className="submit">Add Birthday</button>
                </div>
              </div>
            </form>
          </div>

        </header>
    );
  }
}


// export default App;
