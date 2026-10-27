1
100%
 jQuery(document).ready(function($){
     
   "use strict"
   

   
     // Smooth Scroll - START
    $("a.smooth-scroll").on("click", function (e) {
        e.preventDefault();
        var target = $(this).attr("href");
        if ($(target).length) {
            $("html, body").stop().animate({
                scrollTop: $(target).offset().top - 70
            }, 800);
        }
    });
    // Smooth Scroll - END
    $('.slider').ripples({
      dropRadius: 11,
      perturbance: 0.01,
       
    });
  

     $(".text").typed({
        strings:["<strong>DO IT NOW </strong><strong class='primary'></strong>","<strong> FOR BETTER </strong><strong class='primary'> FUTURE </strong>"],
         typeSpeed:0,
         loop:true
         
     });
     
    $(window).scroll(function(){
        
       var top = $(window).scrollTop();
        if(top>=60){
          $("nav").addClass('secondary'); 
        }
        
        else 
            if($("nav").hasClass('secondary')){
                $("nav").removeClass('secondary'); 
            }
    });

      //      $('.work').magnificPopup({
//      delegate: 'a',
//      type: 'image',
//      gallery: {
//      enabled: true
//       } 
//    });
     
      $("#team-members").owlCarousel({
    items: 3,
    loop: true,
    autoplay: false,
    autoplayHoverPause: true,
    smartSpeed: 700,
    nav: true,                 // shows the left/right arrows
    navText: ["‹", "›"],       // the < > symbols
    dots: true,
    responsive: {
        0: {
            items: 1
        },
        480: {
            items: 2
        },
        768: {
            items: 3
        }
    }
});
     //     $('.counter').counterUp({
//                delay: 10,
//                time: 4000
//
     

    // CTA Contact: scroll to form, prefill subject and focus the name field
    $('#cta-contact').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        var section = $(href);
        var subj = $(this).data('subject') || '';
        $('html, body').animate({
            scrollTop: section.offset().top - -2
        }, 1250, "easeInOutExpo", function(){
            if(subj) $('#subject').val(subj);
            $('#name').focus();
        });
    });
     new WOW().init();
     
 // Contact form: client-side validation and AJAX submission (works for inline form and modal form)
 $('.contact-form').on('submit', function(e){
     e.preventDefault();
     var $form = $(this);
     var $alert = $form.find('.form-alert');
     var name = $.trim($form.find('[name="name"]').val());
     var email = $.trim($form.find('[name="email"]').val());
     var subject = $.trim($form.find('[name="subject"]').val());
     var message = $.trim($form.find('[name="message"]').val());
     var source = $form.find('[name="source"]').val() || 'inline';

     function showAlert(type, msg){
         if($alert.length === 0){
             // fallback to top page alert
             $alert = $('#form-alert');
         }
         $alert.removeClass('success error').addClass(type).text(msg).show();
         try{ $('html,body').animate({scrollTop: $alert.offset().top - 100}, 300);}catch(e){}
     }

     if(!name){ showAlert('error','Please enter your name.'); return; }
     var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if(!email || !emailPattern.test(email)){ showAlert('error','Please enter a valid email address.'); return; }
     if(subject.length < 3){ showAlert('error','Please enter a subject.'); return; }
     if(message.length < 10){ showAlert('error','Please enter a message (at least 10 characters).'); return; }

     var $btn = $form.find('button[type=submit]');
     var originalBtnText = $btn.text();
     $btn.prop('disabled', true).text('Sending...');

     var postData = {name:name, email:email, subject:subject, message:message, source:source};
     var recaptchaSiteKey = $('body').data('recaptcha-sitekey') || '';
     var recaptchaEnabled = recaptchaSiteKey && recaptchaSiteKey !== 'YOUR_RECAPTCHA_SITE_KEY' && typeof grecaptcha !== 'undefined';

     function doAjaxWithData(data){
         $.ajax({
             url: $form.attr('action'),
             method: 'POST',
             data: data,
             dataType: 'json',
             timeout: 15000
         }).done(function(resp){
             if(resp && resp.success){
                 showAlert('success', resp.message || 'Message sent successfully.');
                 $form[0].reset();
                 // sent animation
                 $btn.addClass('sent').text('Sent');
                 setTimeout(function(){
                     $btn.removeClass('sent').text(originalBtnText);
                 }, 1700);
                 if($form.is('#modal-contactform')){
                     setTimeout(closeModal, 1200);
                 }
             } else {
                 showAlert('error', resp.message || 'An error occurred while sending your message.');
             }
         }).fail(function(){
             showAlert('error','An error occurred while sending your message. Please try again later.');
         }).always(function(){
             $btn.prop('disabled', false).text(originalBtnText);
         });
     }

     if(recaptchaEnabled){
         if(typeof grecaptcha === 'undefined'){
             showAlert('error','reCAPTCHA is not available. Please check your configuration.');
             $btn.prop('disabled', false).text(originalBtnText);
             return;
         }
         // execute v3 action
         grecaptcha.execute(recaptchaSiteKey, {action: 'contact'}).then(function(token){
             postData['g-recaptcha-response'] = token;
             doAjaxWithData(postData);
         }).catch(function(){
             showAlert('error','reCAPTCHA execution failed.');
             $btn.prop('disabled', false).text(originalBtnText);
         });
     } else {
         doAjaxWithData(postData);
     }
 });

 // Quick Contact modal open/close
 function openModal(subject){
     var $modal = $('#quick-contact-modal');
     if(subject) $modal.find('[name="subject"]').val(subject);
     $modal.show().attr('aria-hidden','false');
     $('body').addClass('modal-open');
     $modal.find('[name="name"]').focus();
 }
 function closeModal(){
     var $modal = $('#quick-contact-modal');
     $modal.hide().attr('aria-hidden','true');
     $('body').removeClass('modal-open');
     $modal.find('.form-alert').hide().text('');
 }

 $('#cta-quick').on('click', function(e){
     e.preventDefault();
     var subj = $(this).data('subject') || '';
     openModal(subj);
 });

 $('#quick-contact-modal .modal-close, #quick-contact-modal .modal-overlay').on('click', function(){
     closeModal();
 });

 $(document).on('keydown', function(e){ if(e.key === 'Escape'){ closeModal(); } });
 });