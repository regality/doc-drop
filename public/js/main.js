"use strict";

var id = [ Math.floor(Math.random() * 1e20)
         , Math.floor(Math.random() * 1e20)
         , Math.floor(Math.random() * 1e20)
         , Math.floor(Math.random() * 1e20)
         , Math.floor(Math.random() * 1e20)].join('-');

function getDoc(ele) {
  ele = $(ele);
  var doc = {
    author: currentName(),
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
    '<div class="document well">',
      '<div class="title">',
        doc.title,
      '</div>',
      '<div class="author">',
        doc.author,
      '</div>',
      '<div class="text">',
        doc.text,
      '</div>',
    '</div>'
  ].join('');
  console.log(html);
  html = $(html);
  html.hide();
  draggable(html);
  $(".inner-documents").prepend(html);
  html.animate({width: 'show'}, 'slow');
}

function currentName() {
  return $('#name').val() || 'Guest';
}

function draggable(ele) {
  ele
  .draggable({
    revert: 'valid',
    appendTo: 'body'
  })
  .touch({
     animate: false,
     sticky: false,
     dragx: true,
     dragy: true,
     rotate: false,
     resort: true,
     scale: false
   });
}

$(function() {
  var socket = io.connect();

  socket.on('connect', function() {
    console.log('socket.io connected');
  });

  socket.on('new doc', function(data) {
    if (data.id === id) return;
    createDoc(data.doc);
  });

  draggable($('.document'))

  $('.share').droppable({
    hoverClass: 'share-hover',
    accept: '.document',
    drop: function(e, ui) {
      var ele = ui.draggable;
      var doc = getDoc(ele);
      socket.emit('share', {
        id: id,
        doc: doc
      });
    }
  });

  $('.dummy').droppable({
    // force docs to revert
  });

  $('.edit').droppable({
    hoverClass: 'edit-hover',
    accept: '.document',
    drop: function(e, ui) {
      var $editor = $('#editor');
      var ele = ui.draggable;
      var doc = getDoc(ele);
      $editor.find('input').val(doc.title);
      $editor.find('textarea').val(doc.text);
      $editor.fadeIn();
      $('#save').unbind('click').click(function() {
        updateDoc(
          ele,
          $editor.find('input').val(),
          $editor.find('textarea').val()
        );
        $editor.fadeOut();
      });
      $('#cancel').unbind('click').click(function() {
        $editor.fadeOut();
      });
    }
  });

});
