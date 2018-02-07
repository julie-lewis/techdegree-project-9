// ********************************************
// VARIABLES
// ********************************************
//Top Layer
var body = document.body;
var modalNumber = 0;
//Notifications
var notification = document.getElementById('notification');
var bell = document.getElementById('bell');
// Alert Box
var alertBox = document.getElementById('alert');
var closeAlert = document.getElementById('close-alert');
// Charts
var statFilterButtons = document.getElementsByClassName('stat-filter');
var trafficChartCanvas = document.getElementById('traffic-line-chart');
var dailyTrafficChartCanvas = document.getElementById('daily-traffic-bar-chart');
var mobileUsersChartCanvas = document.getElementById('mobile-users-doughnut-chart');
var trafficChart = newTrafficChart(['16-22', '23-29', '30-5', '6-12', '13-19', '20-26', '27-3', '4-10', '11-17', '18-24', '25-31'], [700, 1250, 750, 1200, 1700, 1400, 1600, 1200, 1900, 1600, 1900]);
// MemberSearch
var userSearch = document.querySelector("input[id='user-search']");
var userDatalist = document.getElementById('matching-users');
var searchResult = [];
//Users
var users = null;
//Send Message
var sendButton = document.getElementById('send');
var messageDiv = document.getElementById('message-user');
var message = '';
var messageNotification = document.createElement('p');

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
    var modal = document.createElement('div');
    modal.id = 'overlay';
    modal.className = 'overlay';
    body.appendChild(modal);
  }
  modalNumber++;
  //Puts modal content div 'modal' inside 'overlay' div
  var modalOverlay = document.getElementById('overlay');
  var modalContent = document.createElement('div');
  modalContent.id = 'modal'+modalNumber;
  modalContent.className = 'modal';
  modalContent.setAttribute('style', 'z-index: 100; border-radius: 5px');
  modalOverlay.appendChild(modalContent);
  //Inputs modal notification inside new p in 'modal' div
  var notice = document.createElement('p');
  notice.innerHTML = notification;
  modalContent.appendChild(notice);
  //Creates closing 'X' and removes modal notifications when clicked
  var close = document.createElement('p');
  close.className = 'close-modal';
  close.innerHTML = 'x';
  close.addEventListener('click', function(){
    modalContent.setAttribute('style', 'display: none');
    modalNumber--;
    if(modalNumber === 0){
      modalOverlay.remove();
    }
  });
  modalContent.appendChild(close);
}
// CLOSES ALERT BOX ON CLICK
closeAlert.addEventListener('click', function(){
  alertBox.setAttribute('style', 'display: none');
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
    var clickedButton = this.innerHTML;

    if (clickedButton === 'Hourly') {
      var chart = newTrafficChart(['9am', '10am', '11am', '12am', '1pm', '2pm', '3m', '4pm', '5pm'], [750, 400, 650, 750, 1000, 500, 450, 200, 600]);
    }
    else if (clickedButton === 'Daily') {
      console.log('Daily');
      var chart = newTrafficChart(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], [1400, 1800, 1500, 1800, 700, 600, 1400]);
    }
    else if (clickedButton === 'Weekly') {
      var chart = newTrafficChart(['1', '2', '3', '4', '5'], [1500, 1300, 1200, 1800, 1600]);
    }
    else if (clickedButton === 'Monthly') {
      var chart = newTrafficChart(['January', 'February', 'March', 'April', 'May', 'June'], [1000, 2000, 5000, 3000, 3500, 4000]);
    }
  });
}
// DAILY TRAFFIC CHART
var dailyTrafficChart = new Chart(dailyTrafficChartCanvas, {
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
var mobileUsersChart = new Chart(mobileUsersChartCanvas, {
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
// Add UPPERCASE to 1st char
function firstUp(string){
  return string[0].toUpperCase() + string.substring(1);
}
//Generate ransom users from randomuser.me
function populate(randomUsers){
  var newMembersDiv = document.getElementById('new-members');
  var recentActivityDiv = document.getElementById('recent-activity');
  var membersActivity = [" posted YourApp's SEO Tips", " commented on Facebook's Changes for 2016",
    " liked the post Facebook's Changes for 2016", " commented on YourApp's SEO Tips"];
  var recentActivity = ['4 hours ago', '5 hours ago', '5 hours ago', '1 day ago'];
  for (var i = 0; i < randomUsers.length; i++) {
    var member = randomUsers[i];
    var memberDiv = document.createElement('div');
    memberDiv.className = 'member';
    //INPUT MEMBER AVATAR
    var imageDiv = document.createElement('div');
    var img = document.createElement('img');
    img.src = member.picture.thumbnail;
    img.alt = firstUp(member.name.first) + ' ' + firstUp(member.name.last);
    img.className ='avatar';
    imageDiv.appendChild(img);
    memberDiv.appendChild(imageDiv);
    // Input 4 New Members
    if (i <= 3){
      var detailsDiv = document.createElement('div');
      //Name
      var name = document.createElement('p');
      name.className = 'member-name';
      name.innerHTML = firstUp(member.name.first) + ' ' + firstUp(member.name.last);
      detailsDiv.appendChild(name);
      // Email
      var email = document.createElement('p');
      email.innerHTML = member.email;
      email.className = 'member-email';
      detailsDiv.appendChild(email);
      memberDiv.appendChild(detailsDiv);
      // Signup Date
      var dateDiv = document.createElement('div');
      dateDiv.className = 'flex-item-last member-signup';
      var signupDate = document.createElement('p');
      var dateOptions = { month: '2-digit', day: '2-digit', year: '2-digit'};
      signupDate.innerHTML = new Date(member.registered).toLocaleDateString('en-US', dateOptions);
      dateDiv.appendChild(signupDate);
      memberDiv.appendChild(dateDiv);
      // HR between individual members
      newMembersDiv.appendChild(memberDiv);
      if (i < 3){
        var line = document.createElement('hr');
        newMembersDiv.appendChild(line);
      }
    }
    // Input 4 different "Recent Activity" members
    else {
      var activityDiv = document.createElement('div');
      memberDiv.appendChild(activityDiv);
      // Activity
      var activity = document.createElement('p');
      activity.innerHTML = firstUp(member.name.first) + ' ' + firstUp(member.name.last) + membersActivity[i -4];
      activityDiv.appendChild(activity);
      // Time
      var time = document.createElement('p');
      time.innerHTML = recentActivity[i -4];
      time.className = 'activity-time';
      activityDiv.appendChild(time);
      // Signup Date
      var arrowDiv = document.createElement('div');
      arrowDiv.className = 'flex-item-last';
      var arrow = document.createElement('p');
      arrow.innerHTML = '›';
      arrow.className = 'activity-arrow';
      arrowDiv.appendChild(arrow);
      memberDiv.appendChild(arrowDiv);
      // HR between activity entries
      recentActivityDiv.appendChild(memberDiv);
      if (i < 7){
        var line = document.createElement('hr');
        recentActivityDiv .appendChild(line);
      }
    }
  }
}

// ********************************************
// MESSAGE USER
// ********************************************
// SEARCH FOR USER
userSearch.onkeyup = function(){
  var input = userSearch.value.toLowerCase();
  searchResult = [];
  var options = '';
  // Checking typing in input field
  while (userDatalist.firstChild) {
    userDatalist.removeChild(userDatalist.firstChild);
  }
  // Checking for blank input
  if (input !== ''){
    //Loop thru and check for match
    for (var i = 0; i < users.length; i++){
      if (users[i].name.first.includes(input) || users[i].name.last.includes(input)){
        searchResult.push(users[i]);
      }
    }
    // Populate search options
    for (var i = 0; i < searchResult.length; i++) {
      var name = firstUp(searchResult[i].name.first) + ' ' + firstUp(searchResult[i].name.last);
      options += '<option value="' + name + '" />';
      userDatalist.innerHTML = options;
    }
  }
};
// SEND BUTTON
sendButton.addEventListener('click', function(e){
  var userSearch = document.querySelector("input[id='user-search']");
  var userMessage = document.getElementById('message').value;
  var validUser = false;
  for (var i = 0; i < users.length; i++) {
    var userInfo = firstUp(users[i].name.first) + ' ' + firstUp(users[i].name.last);
    if (userInfo === userSearch.value){
      validUser = true;
    }
  }
  // Check input and display submit message
  if (userMessage !== '' && userMessage !== null && validUser === true){
    message = 'Message sent successfully';
    messageNotification.innerHTML = (message);
    messageDiv.appendChild(messageNotification);
  }
  else {
    message = 'Please choose a member and write a message';
    messageNotification.innerHTML = (message);
    messageDiv.appendChild(messageNotification);
    var validUser = false;
  }
});

// ********************************************
// SAVE SETTINGS IN LOCAL STORAGE
// ********************************************
// Test for existence of local storage
if ('localStorage' in window && window['localStorage'] !== null){
  var emailSwitch = document.getElementById('switch-email');
  var publicSwitch = document.getElementById('switch-public');
  var timeZone = document.getElementById('time-zone');
  var saveButton = document.getElementById('save-settings');
  // Add event listener to save button and to local storage
  saveButton.addEventListener('click', function () {
    localStorage.publicState = publicSwitch.checked;
    localStorage.emailState = emailSwitch.checked;
    localStorage.selectedIndex = timeZone.selectedIndex;
    localStorage.exists = true;

  });
  // Check saved settings
  if (localStorage.exists) {
    publicSwitch.checked = JSON.parse(localStorage.publicState);
    emailSwitch.checked = JSON.parse(localStorage.emailState);
    timeZone.selectedIndex = localStorage.selectedIndex;
  }
}
