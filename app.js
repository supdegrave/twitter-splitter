var Settings, 
    input;

$( function() {
  Settings = {    
    DelimiterStyle: '[x/y]',
    DelimiterLocation: 'End',
    BreakOnSentenceEnd: 'Yes'
  };

  // bind textarea content change handler
  input = $('#input')
  input.bind('input propertychange', function() {
    $('#output').val( tweetify() );
  });
  
  // bind radio group change handlers 
  $.each( ['DelimiterStyle', 'DelimiterLocation', 'BreakOnSentenceEnd'], function (key, value) {
    var radios = $('input:radio[name=' + value +']');
    radios.change( function() { 
      Settings[value] = radios.filter(':checked').val();
      $('#output').val( tweetify() );
    });
  }); 
});


function tweetify() {
  var message = input.val();
  var delimiterLength = Settings.DelimiterStyle.length + 1; // add 1 for whitespace 
  var tweetLength = 140; // twitter length limit 
  var len = tweetLength - delimiterLength;
  var messages = [];
  var newline, sentence, slicePoint, retval;
  
  while (message.length != 0) {
    newline = message.lastIndexOf('\n', len);
    sentence = message.lastIndexOf('.', len);
    
    slicePoint = (-1 !== newline) 
      ? newline : ("Yes" === Settings.BreakOnSentenceEnd && -1 !== sentence) 
        ? sentence + 1 : (message.length > len) 
          ? message.lastIndexOf(' ', len) : len;

    messages.push(message.slice(0, slicePoint));
    message = message.slice(slicePoint < len ? slicePoint + 1 : len).trim();
  }
    
  messages = messages.filter( function(elem) {
    return elem.trim().length > 0;
  });
  
  return $.map( messages, function(value, index) {
    var delimiter = Settings.DelimiterStyle.replace('x', index + 1).replace('y', messages.length);
    
    return "End" == Settings.DelimiterLocation 
      ? value.trim() + " " + delimiter
        : delimiter + " " + value.trim()
  }).join('\n');
}