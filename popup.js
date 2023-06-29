document.addEventListener('DOMContentLoaded', function () {
  let verbs = []; // Global variable to store the parsed verbs
  let rightAnswers = 0; // Counter for the number of right answers
  let totalQuestions = 0; // Counter for the total number of questions
  let currentShownVerb;

  document.getElementById('verbs-button').addEventListener('click', function () {
    parseFile2('verb');
  });
  
  document.getElementById('adjectives-button').addEventListener('click', function () {
    alert("Not implemented yet");
    //parseFile2('adjective');
  });
  
  document.getElementById('der-button').addEventListener('click', function () {
    alert("Not implemented yet");
    //parseFile2('der');
  });
  
  function parseFile2(type) {
    let file;
    if(type == 'verb')  file = 'data/verbs.ods';
    else if(type == 'adjective') file='adjective.ods';
    else if(type == 'der') file='der.ods';

    const reader = new FileReader();
  
    reader.onload = function (event) {
      const contents = event.target.result;
      const workbook = XLSX.read(contents, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Assuming the question column is the first column and the answer column is the second column
      verbs = jsonData.map((row) => ({
        question: row[0] ? row[0].toString().trim() : '',
        answer: row[1] ? row[1].toString().trim() : '',
      }));
  
      // Enable the "Start Quiz" button
      document.getElementById('start-quiz').disabled = false;
  
      // Use the verbs data as needed
      console.log(verbs);
    };
  
    // Read the file
    fetch(file)
      .then((response) => response.blob())
      .then((blob) => reader.readAsBinaryString(blob));
  }
  
  
  // Retrieve the verbs from the uploaded file
  function parseFile(file) {
    const reader = new FileReader();
  
    reader.onload = function (event) {
      const contents = event.target.result;
      const workbook = XLSX.read(contents, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Assuming the question column is the first column and the answer column is the second column
      verbs = jsonData.map((row) => ({
        question: row[0] ? row[0].toString().trim() : '',
        answer: row[1] ? row[1].toString().trim() : '',
      }));
  
      // Send the parsed verbs to the content script
      // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //   chrome.tabs.sendMessage(tabs[0].id, { command: 'parsedVerbs', verbs });
      // });
  
      // Enable the "Start Quiz" button
      document.getElementById('start-quiz').disabled = false;
    };
  
    reader.readAsBinaryString(file);
  }
  
  // Handle file upload
  document.getElementById('file-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    console.log(event.target.files[0]);
    parseFile(file);
  });
  
  // Handle "Start Quiz" button click
  document.getElementById('start-quiz').addEventListener('click', function () {
    // Reset counters
    rightAnswers = 0;
    totalQuestions = 0;
  
    // Hide the "Start Quiz" button and show the form
    document.getElementById('start-quiz').style.display = 'none';
    document.getElementById('answer-form').style.display = 'block';
  
    // Start the quiz
    showNextQuestion();
    updateCounter();
  });
  
  // Retrieve a random verb from the parsed verbs
  function getRandomVerb() {
    const randomIndex = Math.floor(Math.random() * verbs.length);
    return verbs[randomIndex];
  }
  
  // Show the next question
  function showNextQuestion() {
    const currentVerb = getRandomVerb();
    currentShownVerb = currentVerb;
    showQuestion(currentShownVerb.question);
  }
  
  // Show the question
  function showQuestion(question) {
    const questionElement = document.getElementById('question');
    questionElement.textContent = question;
    totalQuestions++;
  }
  
  // Update the counter
  function updateCounter() {
    const counterElement = document.getElementById('counter');
    counterElement.textContent = `Right Answers: ${rightAnswers} / Total Questions: ${totalQuestions}`;
  }

  function handleWrongAnswer(question) {
    const container = document.getElementById('wrong-answers-container');
    const questionElement = document.createElement('p');
    questionElement.textContent = question;
    container.appendChild(questionElement);
  }
  
  // Handle form submission
  document.getElementById('answer-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const answerInput = document.getElementById('answer-input');
    const answer = answerInput.value.trim().toLowerCase();
    const currentVerb = currentShownVerb;
  
    if (answer === currentVerb.answer.toLowerCase()) {
      // Correct answer
      rightAnswers++;
      alert('Correct!');
      answerInput.value = ''; // Clear the answer input field
    } else {
      // Incorrect answer
      alert(`Wrong answer! The correct answer is: ${currentVerb.answer}`);
      handleWrongAnswer(currentVerb.question + " - " + currentVerb.answer);
      answerInput.value = '';
    }
  
    // Show the next question
    showNextQuestion();
    updateCounter();
  });
  
});
  