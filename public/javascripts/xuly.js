// $(document).ready(function() {
//     $('.curriculum-chapter').click(function() {
//       $(this).siblings(".chapter-lessons").toggle();
//     });
//   });
$('.curriculum-chapter').on('click', function(){
    $(this).next().slideToggle('fast');
});