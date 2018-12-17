/*
* Name: Tal Wolman
* Date: Nov 14, 2018
* Section: CSE 154 AA
* This is the JS to implement my debugging page and allows for the user to click and interact with
* the page as well as gets the information to add it to the page
*/


(function() {
  "use strict";

  const BASE = "index.php"; // base url for fetch calls to index.php file

  window.addEventListener("load", initialize);

  /**
   * added functionality for when the page loads, sets up the buttons
   */
  function initialize() {
    $("advice").addEventListener("click", getAdvice);
    $("frequentbugs").addEventListener("click", getFrequentBugs);
  }

  /**
   * gets all the necessary information to add to the page when the get advice button is clicked
   * will fetch using from the index.php and will randomly choose which piece of advice to
   * provide. Also gives functionality to the collapse function
   */
  function getAdvice() {
    $("adviceinfo").classList.remove('hidden');
    $("frequentbugs").classList.add('hidden');
    let url = BASE + "?strategy=rand";
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(presentInformation)
      .catch(handleError);
    $("collapse1").addEventListener("click", function() {
      $("adviceinfo").classList.add('hidden');
      $("frequentbugs").classList.remove('hidden');
    });
    clearChildren("response");
  }

  /**
   * this function will make the fetch call to my index.php file with the personal parameter
   * and gives functionality to the collapse button
   */
  function getFrequentBugs() {
    $("relatableinfo").classList.remove('hidden');
    $("advice").classList.add('hidden');
    let url = BASE + "?personal";
    fetch(url)
      .then(checkStatus)
      .then(personalInfo)
      .catch(handleError);
    $("collapse2").addEventListener("click", function() {
      $("relatableinfo").classList.add('hidden');
      $("advice").classList.remove('hidden');
    });
    clearChildren("mybugs");
  }

  /**
   * this function will add advice to the page including the type of advice, a fun gif to
   * go along with it and a description that contains the advice
   * @param {object} response - the information from the fetch call that can now be added to the
   * page
   */
  function presentInformation(response) {
    let index = $("response");
    let title = document.createElement("h3");
    title.innerText = response["strategy"];
    index.appendChild(title);
    let num = Math.floor(Math.random() * response["information"].length);
    let specifics = response["information"][num];
    let gif = document.createElement("img");
    gif.src = specifics["gif"];
    gif.alt = "a fun gif to go along with some stellar advice";
    index.appendChild(gif);
    let information = document.createElement("p");
    information.innerText = specifics["advice"];
    index.appendChild(information);
  }

  /**
   * function that adds a message to the page of an error occurs
   */
  function handleError() {
    $("response").innerText = "yikes, no advice available at the moment, there's a bug, how ironic";
  }

  /**
   * gets all the information to fill in the information for my frequent bugs
   * @param {object} response - the information from the fetch call that can now be added to the
   * page
   */
  function personalInfo(response) {
    let bugs = $("mybugs");
    let intro = document.createElement("h3");
    intro.innerText = "I always get the dumbest bugs. Here is a big ol' collection of bugs that I" +
                      " encounter";
    bugs.appendChild(intro);
    let information = document.createElement("p");
    information.innerText = response;
    bugs.appendChild(information);
  }

  /**
   * this function removes all the children of an element
   * @param {string} reference - represents the id of the element who's children will be removed
   */
  function clearChildren(reference) {
    while ($(reference).firstChild) {
      $(reference).removeChild($(reference).firstChild);
    }
  }

  // --------- HELPER FUNCTIONS copied directly from template -------------------------//
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id
   */
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
