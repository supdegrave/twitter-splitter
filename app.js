var Position = { Any: 'any', Start: 'start', End: 'end' }, 
  
    Delimiters = {
      XYbrackets : { value: '[x/y]', position: Position.Any },
      XYplain    : { value: 'x/y', position: Position.Any },
      Xcolon     : { value: 'x:', position: Position.Start },
      Xonly      : { value: 'x', position: Position.Any }
    },
    
    Settings = {    
      DelimiterStyle     : Delimiters.XYbrackets.value,
      DelimiterLocation  : Position.End,
      BreakOnSentenceEnd : true
    }, 
    
    input;

$( function() {
  // bind textarea content change handler
  input = $('#input');
  input.bind('input propertychange', function(e) {
    tweetify();
  });

  $('input:radio[name=DelimiterStyle]').change( function() { 
    Settings.DelimiterStyle = Delimiters[this.id].value;
    tweetify();
  });

  $('input:radio[name=DelimiterLocation]').change( function() { 
    Settings.DelimiterLocation = this.id.slice(this.id.indexOf('-') + 1);
    tweetify();
  });

  $('input:radio[name=BreakOnSentenceEnd]').change( function() { 
    Settings.BreakOnSentenceEnd = !!this.id.match("yes")
    tweetify();
  });
});

function tweetify() {
  var message         = input.val(),
      messages        = [],
      tweetLength     = 140, // twitter length limit 
      delimiterLength = Settings.DelimiterStyle.length + 1, // add 1 for whitespace 
      len             = tweetLength - delimiterLength,
      newline, sentence, slicePoint, retval;

  if (message.length > len) {
    while (message.length != 0) {
      newline = message.lastIndexOf('\n', len);
      sentence = message.lastIndexOf('. ', len);

      slicePoint = (-1 !== newline) 
        ? newline : (Settings.BreakOnSentenceEnd && -1 !== sentence) 
          ? sentence + 1 : (message.length > len) 
            ? message.lastIndexOf(' ', len) : len;

      messages.push(message.slice(0, slicePoint));
      message = message.slice(slicePoint < len ? slicePoint + 1 : len).trim();
    }

    messages = messages.filter( function(elem) {
      return elem.trim().length > 0;
    });
  }
  else {
    messages.push(message);
  }
  
  retval = (1 === messages.length) 
  ? messages[0] 
  : $.map( messages, function(value, index) {
    var delimiter = Settings.DelimiterStyle
                    .replace('x', index + 1)
                    .replace('y', messages.length);
                    
    return Position.End == Settings.DelimiterLocation 
      ? value.trim() + " " + delimiter
        : delimiter + " " + value.trim()
  }).join('\n');
  
  $('#output').val(retval);
}