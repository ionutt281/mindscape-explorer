$(document).ready(function() {
            
            // Audio Player functionality
            const audio = new Audio();
            let currentTrack = 0;
            let isPlaying = false;
            
            
            // Load track
            function loadTrack(index) {
                const trackItem = $('.playlist-item').eq(index);
                const src = trackItem.data('src');
                
                $('.playlist-item').removeClass('active');
                trackItem.addClass('active');
                
                audio.src = src;
                audio.load();
                
                audio.onloadedmetadata = function() {
                    updateTimeDisplay();
                    $('.player-title').text(trackItem.text());
                };
                
                audio.onended = function() {
                    playNext();
                };
            }
            
            // Play audio
            function playAudio() {
                audio.play();
                isPlaying = true;
                $('#play-btn').html('<i class="fas fa-pause"></i>');
            }
            
            // Pause audio
            function pauseAudio() {
                audio.pause();
                isPlaying = false;
                $('#play-btn').html('<i class="fas fa-play"></i>');
            }
            
            // Play next track
            function playNext() {
                currentTrack = (currentTrack + 1) % $('.playlist-item').length;
                loadTrack(currentTrack);
                if (isPlaying) {
                    playAudio();
                }
            }
            
            // Play previous track
            function playPrev() {
                currentTrack = (currentTrack - 1 + $('.playlist-item').length) % $('.playlist-item').length;
                loadTrack(currentTrack);
                if (isPlaying) {
                    playAudio();
                }
            }
            
            // Update progress bar
            function updateProgress() {
                const progress = (audio.currentTime / audio.duration) * 100;
                $('#progress-bar').css('width', progress + '%');
                updateTimeDisplay();
            }
            
            // Update time display
            function updateTimeDisplay() {
                const currentMinutes = Math.floor(audio.currentTime / 60);
                const currentSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
                const durationMinutes = Math.floor(audio.duration / 60);
                const durationSeconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
                
                $('#current-time').text(`${currentMinutes}:${currentSeconds}`);
                $('#duration').text(`${durationMinutes}:${durationSeconds}`);
            }
            
            // Set progress when clicked
            $('#progress-container').click(function(e) {
                const width = $(this).width();
                const clickX = e.offsetX;
                const duration = audio.duration;
                audio.currentTime = (clickX / width) * duration;
            });
            
            // Player controls
            $('#play-btn').click(function() {
                if (isPlaying) {
                    pauseAudio();
                } else {
                    playAudio();
                }
            });
            
            $('#prev-btn').click(function() {
                playPrev();
            });
            
            $('#next-btn').click(function() {
                playNext();
            });
            
            // Playlist item click
            $(document).on('click', '.playlist-item', function() {
                currentTrack = $(this).index();
                loadTrack(currentTrack);
                if (isPlaying) {
                    playAudio();
                }
            });
            
            // Upload audio
            $('#upload-btn').click(function() {
                $('#file-upload').click();
            });
            
            $('#file-upload').change(function() {
                const file = this.files[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    $('#playlist').append(`<div class="playlist-item" data-src="${url}">${file.name}</div>`);
                }
            });
            
            // Add URL
            $('#add-url-btn').click(function() {
                const url = $('#audio-url').val().trim();
                if (url) {
                    $('#playlist').append(`<div class="playlist-item" data-src="${url}">Custom Track</div>`);
                    $('#audio-url').val('');
                }
            });
            
            
            
               // Player toggle functionality
          
let playerVisible = false;   // Start with player hidden

$('#player-toggle').click(function() {
    playerVisible = !playerVisible;
    if (playerVisible) {
        $('#audio-player').fadeIn(300);
        $(this).html('<i class="fas fa-music"></i>');
    } else {
        $('#audio-player').fadeOut(300);
        $(this).html('<i class="fas fa-headphones"></i>');
    }
});
            
            // Update progress bar continuously
            setInterval(updateProgress, 500);
    
            // Auto-scroll functionality
            let canScroll = true;
            let scrollCooldown = 1200;
            
            function performScroll() {
                if (!canScroll) return;
                
                canScroll = false;
                
                const scrollAmount = $(window).height() * 0.8;
                
                $('html, body').animate({
                    scrollTop: $(window).scrollTop() + scrollAmount
                }, {
                    duration: 700,
                    easing: 'swing',
                    complete: function() {
                        setTimeout(function() {
                            canScroll = true;
                        }, scrollCooldown);
                    }
                });
            }
            
            $('#mobile-scroll-btn').on('touchstart click', function(e) {
                e.preventDefault();
                performScroll();
            });
        });

//Text reader
document.addEventListener('DOMContentLoaded', function() {
            if ('connection' in navigator) {
  console.log('Connection speed:', navigator.connection.effectiveType);
}
            const sentences = document.querySelectorAll('.sentence');
            const playBtn = document.getElementById('play-btn');
            const pauseBtn = document.getElementById('pause-btn');
            const stopBtn = document.getElementById('stop-btn');
            
            let currentSentence = 0;
            let speechActive = false;
            
            // Initialize speech synthesis
            const synth = window.speechSynthesis;
            let utterance = null;
            
            // Reset reading state
            function resetReading() {
                if (utterance) {
                    synth.cancel();
                }
                speechActive = false;
                sentences.forEach(s => s.classList.remove('active'));
            }
            
            // Speak a sentence
            function speakSentence(index) {
                if (index >= sentences.length) {
                    resetReading();
                    return;
                }
                
                resetReading();
                currentSentence = index;
                sentences[index].classList.add('active');
                
                // Scroll to sentence
                sentences[index].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
                
                const text = sentences[index].textContent;
                utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.0;
                
                utterance.onend = () => {
                    setTimeout(() => speakSentence(index + 1), 300);
                };
                
                synth.speak(utterance);
                speechActive = true;
            }
            
            // Event listeners
            playBtn.addEventListener('click', () => {
                if (!speechActive) {
                    speakSentence(currentSentence);
                }
            });
            
            pauseBtn.addEventListener('click', () => {
                if (speechActive && synth.speaking) {
                    synth.pause();
                    speechActive = false;
                }
            });
            
            stopBtn.addEventListener('click', () => {
                resetReading();
                currentSentence = 0;
            });
            
            // Add click event to sentences
            sentences.forEach((sentence, index) => {
                sentence.addEventListener('click', () => {
                    resetReading();
                    currentSentence = index;
                    sentences.forEach(s => s.classList.remove('active'));
                    sentence.classList.add('active');
                });
            });
            
            // Add highlight on double-click
            sentences.forEach(sentence => {
                sentence.addEventListener('dblclick', function() {
                    this.classList.toggle('highlight');
                });
            });
            
            // Simulate reading progress
            setInterval(() => {
                const progressBar = document.querySelector('.progress-bar');
                const width = parseFloat(progressBar.style.width);
                if (width < 100) {
                    progressBar.style.width = (width + 0.1) + '%';
                }
            }, 3000);
        });


// Add web vitals tracking
const reportWebVitals = () => {
  if (window.ga) {
    ga('send', 'event', {
      eventCategory: 'Web Vitals',
      eventAction: 'track',
      eventValue: Math.round(performance.now())
    });
  }
};

// Add lazy loading
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
  
  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});
