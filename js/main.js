var SUCCESS_COLOR = '#00c76a';
var FAIL_COLOR = '#e60b00';
var ADD_PROBABILITY = 0.5;
var KEEP_GOING_PROBABILITY = 0.625;
var ADDED_HEIGHT = 32; //2rem for margin
var ALL_ICON_CLASSES = 'hidden fa-check fa-times fa-exclamation-triangle';

$(document).ready(function() {
  for(var i = 0; i < 10; i++) {
    $('.problems').append(getProblemHTML(generateProblem()));
  }
  updateIndices();

  $('.error').css('opacity', 0);

  $('body').on('click', '.submit', function() {
    //show modal
    mmm('You need to submit all the problems before you finish.');

    //highlight unfinished
    $('.problem').each(function() {
      var icon = $(this).find('.fa');
      if($(this).attr('data-solved') === "false" && icon.hasClass('hidden')) {
        icon.removeClass(ALL_ICON_CLASSES).addClass('fa-exclamation-triangle');
        icon.css('color', '#333');
      }
    });
  });

  $('body').on('keypress', 'input', function(e) {
    var code = e.keyCode || e.which;
    if(code == 13) { //Enter keycode
      $(this).parent().find('button').click();
    }
  });

  $('body').on('click', '.submit-problem', function(e) {
    var problem = $(e.target.parentNode.parentNode);
    var problemInput = problem.find('input');
    var icon = problem.find('.fa');
    var guess = problemInput.val();
    var answer = problem.attr('data-answer');
    if(answer === guess) {
      icon.removeClass(ALL_ICON_CLASSES).addClass('fa-check');
      //problemInput.css('background-color', SUCCESS_COLOR);
      icon.css('color', SUCCESS_COLOR);
      problem.attr('data-solved', true);
    } else {
      icon.removeClass(ALL_ICON_CLASSES).addClass('fa-times');
      //problemInput.css('background-color', FAIL_COLOR);
      icon.css('color', FAIL_COLOR);
      problem.attr('data-solved', false);
    }

    //check all problems solved
    var allSolved = true;
    $('.problem').each(function() {
      if($(this).attr('data-solved') === "false") {
        allSolved = false;
      }
    });

    if(allSolved) { //make something wrong
      var keepGoingSwitch = 0; //go at least once

      while(keepGoingSwitch < KEEP_GOING_PROBABILITY) {
        keepGoingSwitch = Math.random(); //set to random for next time

        var possibilities = [];
        $('.problem').each(function() {
          if(!visible(this)) {
            possibilities.push(this);
          }
        });

        if(possibilities.length === 0) {
          mmm('You win!');
        } else {
          var problem = $(possibilities[Math.floor(Math.random()*possibilities.length)]);

          var methodSwitch = Math.random();

          if(methodSwitch < ADD_PROBABILITY) { //add a problem

            var beforeIndex = parseFloat($(problem).find('.num').text());
            var afterIndex = parseFloat($(problem).next().find('.num').text());
            var newIndex;

            if(beforeIndex && afterIndex) {
              //average
              newIndex = beforeIndex + ( (afterIndex - beforeIndex) / 2 );
            } else if(!beforeIndex) {
              newIndex = afterIndex - 1;
            } else if(!afterIndex) {
              newIndex = beforeIndex + 1;
            }

            problem.after(getProblemHTML(generateProblem(), newIndex));

            if(problem.offset().top < $(window).scrollTop()) {
              var originalHeight = parseInt($('.main').scrollTop());
              var problemHeight = parseInt($('.problem').outerHeight());
              $('.main').scrollTop( originalHeight + problemHeight + ADDED_HEIGHT);
            }

            //updateIndices();
          } else { //change a problem

            //generate until we get a different one
            var newProblem = null;
            while(newProblem === null || newProblem.answer === problem.attr('data-answer')) {
              newProblem = generateProblem();
            }

            problem.attr('data-solved', false);
            problem.attr('data-answer', newProblem.answer);
            problem.find('.problem-text').text(newProblem.problem);
            problem.find('.fa').css('color', FAIL_COLOR);
            problem.find('.fa').removeClass('hidden fa-check').addClass('fa-times');
          }
        }
      }
    }
  });
});

function visible(element) {
  var height = document.documentElement.clientHeight,
  rects = element.getClientRects();
  for (var i = 0, l = rects.length; i < l; i++) {
    var r = rects[i],
    in_viewport = r.top > 0 ? r.top <= height : (r.bottom > 0 && r.bottom <= height);
    if (in_viewport) return true;
  }
  return false;
}

function generateProblem() {
  var operators = ['+', '-', '*', '/'];
  var operator = operators[Math.floor(Math.random()*operators.length)];

  var min, max, num1, num2;

  if(operator === '+') {
    min = 0;
    max = 20;
    num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  } else if(operator === '-') {
    min = 2; max = 20;
    num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    max = num1;
    num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  } else if(operator === '*') {
    min = 0;
    max = 12;
    num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  } else if(operator === '/') {
    min1 = 1, min2 = 0; //avoid divide by zero
    max = 12;
    factor1 = Math.floor(Math.random() * (max - min1 + 1)) + min1;
    factor2 = Math.floor(Math.random() * (max - min2 + 1)) + min2;
    num1 = factor1 * factor2;
    num2 = factor1;
  }

  var problem = num1 + ' ' + operator + ' ' + num2;
  var answer = eval(problem);

  return  {answer: answer, problem: problem};
}

function getProblemHTML(problem, index) {
  if(!index) { index = ''; }
  return '<div class="problem" data-solved="false" data-answer="' + problem.answer
    + '"><div class="num">' + index + '</div><div class="problem-data"><span class="problem-text">' + problem.problem
    + '</span><input type="text" /><i class="hidden fa"></i>'
    + '<button class="submit-problem">Submit</button></div></div>';
}

function updateIndices() {
  $('.problem').each(function(index) {
    $(this).find('.num').text(index+1);
  });
}