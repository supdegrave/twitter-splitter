var Position = { Any: 'any', Start: 'start', End: 'end' }, 
  
    Delimiters = {
      XYbrackets : { value: '[x/y]', position: Position.Any },
      XYplain    : { value: 'x/y', position: Position.Any },
      Xcolon     : { value: 'x:', position: Position.Start },
      Xonly      : { value: 'x', position: Position.Any }
    },
    
    Settings = {    
      DelimiterStyle     : Delimiters.XYbrackets,
      DelimiterLocation  : Position.End,
      BreakOnSentenceEnd : true
    }, 
    
    MODE = 'debug',
    
    input;

$( function() {
  // bind textarea content change handler
  input = $('#input');
  input.bind('input propertychange', function(e) {
    tweetify();
  });

  $('input:radio[name=DelimiterStyle]').change( function() { 
    debug(this);
    Settings.DelimiterStyle = Delimiters[this.id];
    
    if (Settings.DelimiterStyle === Delimiters.Xcolon) {
      $('input#location-beginning').attr('checked', true);
      Settings.DelimiterLocation = Position.Start;
    }
    
    $('input#location-end').attr('disabled', (Settings.DelimiterStyle === Delimiters.Xcolon));
    
    tweetify();
  });

  $('input:radio[name=DelimiterLocation]').change( function() { 
    debug(this);
    Settings.DelimiterLocation = this.id.slice(this.id.indexOf('-') + 1);
    tweetify();
  });

  $('input:radio[name=BreakOnSentenceEnd]').change( function() { 
    debug(this);
    Settings.BreakOnSentenceEnd = !!this.id.match("yes")
    tweetify();
  });
});

function tweetify() { 
  var message         = input.val(),
      messages        = [],
      tweetLength     = 140, // twitter length limit 
      delimiterMask   = Settings.DelimiterStyle.value, 
      delimiterLength = delimiterMask.length + 1, // add 1 for whitespace 
      len             = tweetLength - delimiterLength,
      newline, sentence, slicePoint, retval;

  if (message.length > len) {
    while (message.length != 0) {
      newline  = message.lastIndexOf('\n', len);
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
    var delimiter, tweet;
    delimiter = delimiterMask.replace('x', index + 1).replace('y', messages.length);
    tweet = [value.trim(), delimiter];
    
    return Position.End === Settings.DelimiterLocation 
      ? tweet.join(' ') 
        : tweet.reverse().join(' ');
  }).join('\n');
  
  $('#output').val(retval);
}

function debug() {
  if ('debug' === MODE) {
    console.log(arguments);
    // arguments.forEach( function(arg) {
    //   console.log(arg);
    // });
  }
}