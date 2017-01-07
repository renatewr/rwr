/*jslint browser:true */

"use strict";

const keyValStore = require('./keyval.js'),
      utils  = require('../../../browser/utils.js');
    

const listPrototype = Object.create(HTMLElement.prototype);
const newTodoForm = document.getElementById('new-cow-form');
const newTodoInput = document.getElementById('new-cow');
const newTodoName = document.getElementById('new-cow-name');
const newTodoDate = document.getElementById('new-cow-date');
var todoList = document.getElementById('cow-items');

const refreshCows = function() {
  return new Promise((resolve, reject) => {
    const cowMarkup = keyValStore.keys()
      .then((cows) => {   
        todoList.innerHTML = cows.map(cow => `
          <li data-id="${cow.timestamp}">            
            <label><input class="toggle" type="checkbox"></input>${cow.text}</label>
            <div>${cow.name}</div>
            <div>${cow.regDate}</div>
            <button class="destroy"></button>
          </li>`).join('');
      })
      if (cowMarkup){
        resolve(cowMarkup);
      } else{
        reject(Error('Dont work'));
      }    
  })
};

const eventHandlerFunction = function(id){
  keyValStore.delete(id)
  .then(() => {        
    updateList();
  });  
}

const updateList = function (){
  refreshCows()
    .then(()=> {
      let deleteElements = utils.qsAll('.destroy');    
      for (const element of [...deleteElements]) {
        element.addEventListener('click', function() {          
          const id = parseInt(this.parentElement.getAttribute('data-id'));
          eventHandlerFunction(id);          
        });
      };
    });
}

listPrototype.attachedCallback = function(){
  const self = this;
  
falseStr = "false";

console.log("boolean", Boolean(falseStr);
if(true){
  var falseStr;
  if(falseStr){
   console.log("false" == true);
   console.log(Boolean(falseStr) == false);
  }
};
  
  updateList();
  
  newTodoForm.onsubmit = function() {
  if (!window.indexedDB) {
    todoList.innerHTML = `
    <li>
      Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.
    </li>`;
  } else {
    // Get the todo text.
    const text = newTodoInput.value;
    const timestamp = new Date().getTime();
    const cow = {
      'text':text, 
      'timestamp':timestamp,
      'name':newTodoName.value,
      'regDate':newTodoDate.value
      
    };

    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g,'') != '') {
      // Create the todo item.
      keyValStore.set(timestamp, cow)
      .then(() => {        
        updateList();
      });  
    }
  }

    // Reset the input field.
  newTodoInput.value = '';

  // Don't send the form.
  return false;
  };
  
};

document.registerElement('moo-list', {
  prototype: listPrototype
});


