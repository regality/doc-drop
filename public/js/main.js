"use strict";

function getDoc(ele) {
  ele = $(ele);
  var doc = {
    title: ele.find('.title').filter(':first').text(),
    text: ele.find('.text').filter(':first').text()
  };
  return doc;
}

function updateDoc(ele, title, text) {
  ele = $(ele);
  ele.find('.title').text(title);
  ele.find('.text').text(text);
}

function createDoc(doc) {
  var html = [
    '<div class="document well" style="display:none;">',
      '<div class="title">',
        doc.title,
      '</div>',
      '<div class="text">',
        doc.text,
      '</div>',
    '</div>'
  ].join('');
  html = $(html);
  $(".documents").prepend(html);
  html.animate({width: 'show'}, 'slow');
}

function currentName() {
  return $('#name').val() || 'Guest';
}

(function ($) {
  $.fn.liveDraggable = function (opts) {
    this.live("mouseover", function() {
      if (!$(this).data("init")) {
        $(this).data("init", true).draggable(opts);
      }
    });
    return $();
  };
}(jQuery));

$(function() {
  var socket = io.connect();

  socket.on('connect', function() {
    console.log('socket.io connected');
  });

  socket.on('new doc', function(data) {
    if (data.name === currentName()) return;
    createDoc(data.doc);
  });

  $('.document').liveDraggable({
    revert: 'valid'
  });

  $('.target').droppable({
    hoverClass: 'target-hover',
    accept: '.document',
    drop: function(e) {
      var doc = getDoc(e.srcElement);
      socket.emit('share', {
        name: currentName(),
        doc: doc
      });
    }
  });

  $('.document').live('click', function() {
    var $editor = $('#editor');
    var ele = this;
    var doc = getDoc(ele);
    $editor.find('input').val(doc.title);
    $editor.find('textarea').val(doc.text);
    $('#save').click(function() {
      updateDoc(
        ele,
        $editor.find('input').val(),
        $editor.find('textarea').val()
      );
      $editor.dialog('close');
    });
    $('#cancel').click(function() {
      $editor.dialog('close');
    });
    $editor.dialog({
      height: 400,
      width: 600,
      modal: true
    });
  });

});
