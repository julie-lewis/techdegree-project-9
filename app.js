// ********************************************
// VARIABLES
// ********************************************
//Top Layer
const wrapper = document.getElementsByClassName('wrapper')[0];
const body = document.body;
let modalNumber = 0;
//Notifications
const notification = document.getElementById('notification');
const bell = document.getElementById('bell');
// Alert Box
const alert = document.getElementById('alert');
const closeAlert = document.getElementById('close-alert');
// Charts
const statFilterButtons = document.getElementsByClassName('stat-filter');
const trafficChartCanvas = document.getElementById('traffic-line-chart');
const dailyTrafficChartCanvas = document.getElementById('daily-traffic-bar-chart');
const mobileUsersChartCanvas = document.getElementById('mobile-users-doughnut-chart');
const trafficChart = newTrafficChart(['16-22', '23-29', '30-5', '6-12', '13-19', '20-26', '27-3', '4-10', '11-17', '18-24', '25-31'], [700, 1250, 750, 1200, 1700, 1400, 1600, 1200, 1900, 1600, 1900]);
// MemberSearch
const userSearchField = document.querySelector("input[id='user-search']");
const userDatalist = document.getElementById('matching-users');
let searchResult = [];
//Users
let users = null;
//Send Message
const sendButton = document.getElementById('send');
const messageDiv = document.getElementById('message-user');
let message = '';
let messageNotification = document.createElement('p');

// ********************************************
// NOTIFICATIONS & ALERT BOX
// ********************************************
//Listens for click on bell icon, creates invisible notification icon and modal messages
bell.addEventListener('click', function(event){
  event.target.removeEventListener('click', event);
  notification.setAttribute('style', 'opacity: 0');
  modal('10 New Users have joined today - Say Hello!');
  modal('You have been mentioned in a new comment.');
});
//Creates overlay divs for modal messages if modals exist
function modal(notification){
  if(modalNumber === 0){
    const modal = document.createElement('div');
    modal.id = 'overlay';
    modal.className = 'overlay';
    body.appendChild(modal);
  }
  modalNumber++;
  //Puts modal content div 'modal' inside 'overlay' div
  const modal = document.getElementById('overlay');
  const modalContent = document.createElement('div');
  modalContent.id = 'modal'+modalNumber;
  modalContent.className = 'modal';
  modalContent.setAttribute('style', 'z-index: 100; border-radius: 5px');
  modal.appendChild(modalContent);
  //Inputs modal notification inside new p in 'modal' div
  const notice = document.createElement('p');
  notice.innerHTML = notification;
  modalContent.appendChild(notice);
  //Creates closing 'X' and removes modal notifications when clicked
  const close = document.createElement('p');
  close.className = 'close-modal';
  close.innerHTML = 'x';
  close.addEventListener('click', function(){
    modalContent.setAttribute('style', 'display: none');
    modalNumber--;
    if(modalNumber === 0){
      modal.remove();
    }
  });
  modalContent.appendChild(close);
}
// CLOSES ALERT BOX ON CLICK
closeAlert.addEventListener('click', function(){
  alert.setAttribute('style', 'display: none');
});

// ********************************************
// TRAFFIC CHARTS
// ********************************************
// GENERAL TRAFFIC CHART
function newTrafficChart(labels, data){
  new Chart(trafficChartCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: '#e2e3f6',
        borderColor: '#7477bf',
        borderWidth: 0.5,
        pointBackgroundColor: 'white',
        pointBorderWidth: 1,
        radius: 5
      }]
    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      },
      elements: {
        line: {
          tension: 0, 
        }
      }
    }
  });
}
// Adds Traffic filter options (hours/days/weeks/months)
for (button of statFilterButtons){
  button.addEventListener('click', function(e){
    for (button of statFilterButtons){
      button.classList.remove('active-filter');
    }
    this.classList.add('active-filter');
    const clickedButton = this.innerHTML;

    if (clickedButton === 'Hourly') {
      const chart = newTrafficChart(['9am', '10am', '11am', '12am', '1pm', '2pm', '3m', '4pm', '5pm'], [750, 400, 650, 750, 1000, 500, 450, 200, 600]);
    }
    else if (clickedButton === 'Daily') {
      console.log('Daily');
      const chart = newTrafficChart(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], [1400, 1800, 1500, 1800, 700, 600, 1400]);
    }
    else if (clickedButton === 'Weekly') {
      const chart = newTrafficChart(['1', '2', '3', '4', '5'], [1500, 1300, 1200, 1800, 1600]);
    }
    else if (clickedButton === 'Monthly') {
      const chart = newTrafficChart(['January', 'February', 'March', 'April', 'May', 'June'], [1000, 2000, 5000, 3000, 3500, 4000]);
    }
  });
}
// DAILY TRAFFIC CHART
const dailyTrafficChart = new Chart(dailyTrafficChartCanvas, {
  type: 'bar',
    data: {
      labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      datasets: [{
        data: [30, 50, 100, 90, 130, 110, 50],
        backgroundColor: '#7477bf',
        borderColor: '7477bf',
        borderWidth: 1
      }]
  },
  options: {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  }
});
// MOBILE USERS CHART
const mobileUsersChart = new Chart(mobileUsersChartCanvas, {
  type: 'doughnut',
    data: {
      labels: ['Phones', 'Tablets', 'Desktop'],
      datasets: [{
        data: [15, 15., 70],
        backgroundColor: ['#81c98f', '#74b1bf','#7477bf'],
        borderWidth: 1
      }]
  },
  options: {
    responsive: true,
    legend: {
      position: 'right',
      labels: {
        boxWidth: 10,
      }
    },
    rotation: -0.65 * Math.PI
  }
});

// ********************************************
// MEMBERS
// ********************************************
$.ajax({
  url: 'https://randomuser.me/api/?results=8&inc=name,picture,email,registered',
  dataType: 'json',
  error: function() {
    console.error("Couldn't get random users from API");
  },
  success: function(data) {
    users = data.results;
    populate(users);
  }
});

// CHANGE FIRST CHARACTER TO UPPERCASE
function firstUp(string){
  return string[0].toUpperCase() + string.substring(1);
}

// POPULATE MEMBER SECTIONS using Random Users API https://randomuser.me
function populate(randomUsers){

  //Variable declaration
  const newMembersDiv = document.getElementById('new-members');
  const recentActivityDiv = document.getElementById('recent-activity');
  const membersActivity = [" posted YourApp's SEO Tips", " commented on Facebook's Changes for 2016",
    " liked the post Facebook's Changes for 2016", " commented on YourApp's SEO Tips"];
  const activityTime = ['1 day ago', '5 hours ago', '5 hours ago', '4 hours ago'];

  // Loop through random users to populate member sections
  for (let i = 0; i < randomUsers.length; i++) {

    const member = randomUsers[i];

    // Wrapper div for user info
    const memberDiv = document.createElement('div');
    memberDiv.className = 'member';

    //MEMBER AVATAR
    const imageDiv = document.createElement('div');
    const img = document.createElement('img');
    img.src = member.picture.thumbnail;
    img.alt = firstUp(member.name.first) + ' ' + firstUp(member.name.last);
    img.className ='avatar';
    imageDiv.appendChild(img);
    memberDiv.appendChild(imageDiv);

    // Use the 4 first users to populate "New Members" specific info
    if (i <= 3){

      // Wrapping div
      const detailsDiv = document.createElement('div');

      // Name
      const name = document.createElement('p');
      name.className = 'member-name';
      name.innerHTML = firstUp(member.name.first) + ' ' + firstUp(member.name.last);
      detailsDiv.appendChild(name);

      // Email
      const email = document.createElement('p');
      email.innerHTML = member.email;
      email.className = 'member-email';
      detailsDiv.appendChild(email);
      memberDiv.appendChild(detailsDiv);

      // Signup Date
      const dateDiv = document.createElement('div');
      dateDiv.className = 'flex-item-last member-signup';
      const signupDate = document.createElement('p');
      const dateOptions = { month: '2-digit', day: '2-digit', year: '2-digit'};
      signupDate.innerHTML = new Date(member.registered).toLocaleDateString('en-US', dateOptions);
      dateDiv.appendChild(signupDate);
      memberDiv.appendChild(dateDiv);

      // Line break between members
      newMembersDiv.appendChild(memberDiv);
      if (i < 3){
        const line = document.createElement('hr');
        newMembersDiv.appendChild(line);
      }

    }
    // The 4 last users populates "Recent Activity" specific info
    else {

      // Wrapping div
      const activityDiv = document.createElement('div');
      memberDiv.appendChild(activityDiv);

      // Activity
      const activity = document.createElement('p');
      activity.innerHTML = firstUp(member.name.first) + ' ' + firstUp(member.name.last) + membersActivity[i -4];
      activityDiv.appendChild(activity);

      // Time
      const time = document.createElement('p');
      time.innerHTML = activityTime[i -4];
      time.className = 'activity-time';
      activityDiv.appendChild(time);

      // Signup Date
      const arrowDiv = document.createElement('div');
      arrowDiv.className = 'flex-item-last';
      const arrow = document.createElement('p');
      arrow.innerHTML = '›';
      arrow.className = 'activity-arrow';
      arrowDiv.appendChild(arrow);
      memberDiv.appendChild(arrowDiv);

      // Add linebreak if not the last one
      recentActivityDiv.appendChild(memberDiv);
      if (i < 7){
        const line = document.createElement('hr');
        recentActivityDiv .appendChild(line);
      }
    }
  }
}

// ********************************************
// MESSAGE USER
// ********************************************

// SEARCH FOR USER
userSearchField.onkeyup = function(){

  // Variabe declaration
  const input = userSearchField.value;
  searchResult = [];
  let options = '';

  // Refresh datalist for every character added or removed in iput field
  while (userDatalist.firstChild) {
    userDatalist.removeChild(userDatalist.firstChild);
  }

  // Only look for a match if it's not an empty string
  if (input !== ''){

    //If match save to search result
    for (let i = 0; i < users.length; i++){
      if (users[i].name.first.includes(input) || users[i].name.first.includes(input)){
        searchResult.push(users[i]);
      }
    }

    // Add datalist options with search result
    for (let i = 0; i < searchResult.length; i++) {
      const name = firstUp(searchResult[i].name.first) + ' ' + firstUp(searchResult[i].name.last);
      options += '<option value="' + name + '" />';
      userDatalist.innerHTML = options;
    }

  }

};

// SEND BUTTON
sendButton.addEventListener('click', function(e){

  const userSearchField = document.querySelector("input[id='user-search']");
  const writtenMessage = document.getElementById('message').value;
  let validUser = false;
  for (let i = 0; i < searchResult.length; i++) {

    const userN = firstUp(searchResult[i].name.first) + ' ' + firstUp(searchResult[i].name.last);

    if (userN === userSearchField.value){
      validUser = true;
    }
  }

  // Validate and display message
  if (writtenMessage !== '' && writtenMessage !== null && validUser === true){

    message = 'Message sent successfully';
    messageNotification.innerHTML = (message);
    messageDiv.appendChild(messageNotification);

  }
  else {

    message = 'Please choose a member and write a message';
    messageNotification.innerHTML = (message);
    messageDiv.appendChild(messageNotification);
    let validUser = false;

  }

});

// ********************************************
// SETTINGS
// ********************************************

// Test for local storage before saving to it
if ('localStorage' in window && window['localStorage'] !== null){

  // Variable declaration
  const emailSwitch = document.getElementById('switch-email');
  const publicSwitch = document.getElementById('switch-public');
  const timeZone = document.getElementById('time-zone');
  const saveButton = document.getElementById('save-settings');
  const cancelButton = document.getElementById('cancel-settings');

  // Add event listener to save button and save settings to local storage
  saveButton.addEventListener('click', function () {

    localStorage.publicState = publicSwitch.checked;
    localStorage.emailState = emailSwitch.checked;
    localStorage.selectedIndex = timeZone.selectedIndex;
    localStorage.exists = true;

  });

  // Make sure saved settings shows as displayed
  if (localStorage.exists) {

    publicSwitch.checked = JSON.parse(localStorage.publicState);
    emailSwitch.checked = JSON.parse(localStorage.emailState);
    timeZone.selectedIndex = localStorage.selectedIndex;

  }

}


  








   
    
    
    







