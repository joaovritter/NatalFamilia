<script setup>
import { computed } from 'vue';

const props = defineProps({
    photos: {
        type: Array,
        default: () => []
    }
});

// Sort photos by date if available, or keep original order
const timelinePhotos = computed(() => {
    if (!props.photos || props.photos.length === 0) return [];
    
    // Normalize data: check if items are strings (old format) or objects (new format)
    let items = props.photos.map(p => {
        if (typeof p === 'string') {
            return { src: p, date: null, caption: '' };
        }
        return p;
    });

    // We can also sort here if strictly requested, but "Form Order" is stronger usually.
    // The user moved photos in the form, so let's trust that order.
    return items;
});

const formatDate = (dateString) => {
    if (!dateString) return 'Momento Especial';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

// Intersection Observer for Scroll Animations
import { onMounted, onUnmounted, watch, nextTick } from 'vue';

let observer = null;

const setupObserver = () => {
    if (observer) observer.disconnect();
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    const animatedElements = document.querySelectorAll('.timeline-section .animate-on-scroll');
    if (animatedElements.length > 0) {
        animatedElements.forEach(el => observer.observe(el));
    }
};

onMounted(() => {
    setupObserver();
});

// Watch for data changes to re-attach observer
watch(timelinePhotos, async () => {
    await nextTick();
    setupObserver();
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>

<template>
  <section class="timeline-section" v-if="timelinePhotos.length > 0">
    <div class="content-wrapper">
        <h2 class="section-title">Timeline da Família</h2>
        <p class="section-subtitle">Nossa jornada de momentos inesquecíveis.</p>
        
        <div class="timeline-container">
            <div class="timeline-line"></div>
            
            <div 
                v-for="(photo, index) in timelinePhotos" 
                :key="index"
                class="timeline-item"
                :class="{ 'left': index % 2 === 0, 'right': index % 2 !== 0 }"
            >
                <div class="timeline-content animate-on-scroll">
                    <div class="date-badge">{{ formatDate(photo.date) }}</div>
                    <div class="photo-card">
                        <img :src="photo.src" :alt="photo.caption || 'Foto da Família'" loading="lazy" />
                        <p v-if="photo.caption" class="photo-caption">{{ photo.caption }}</p>
                    </div>
                </div>
                <div class="timeline-dot"></div>
            </div>
        </div>
    </div>
  </section>
</template>

<style scoped>
.timeline-section {
    padding: 80px 20px;
    background: linear-gradient(to bottom, #0f1c13 0%, #050a07 100%);
    color: white;
    overflow: hidden;
    position: relative;
    border-top: 1px solid rgba(248, 178, 41, 0.2);
}

.content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
}

.section-title {
    font-family: var(--font-title, 'Great Vibes', cursive);
    font-size: 3.5rem;
    color: #F8B229;
    text-align: center;
    margin-bottom: 10px;
}

.section-subtitle {
    text-align: center;
    opacity: 0.8;
    margin-bottom: 60px;
    font-size: 1.2rem;
}

.timeline-container {
    position: relative;
    padding: 20px 0;
}

.timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: rgba(248, 178, 41, 0.3);
    transform: translateX(-50%);
    border-radius: 2px;
}

.timeline-item {
    position: relative;
    margin-bottom: 60px;
    width: 100%;
}

.timeline-dot {
    position: absolute;
    left: 50%;
    top: 20px;
    width: 20px;
    height: 20px;
    background: #F8B229;
    border-radius: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 10px rgba(248, 178, 41, 0.6);
    z-index: 10;
}

.timeline-content {
    width: 45%;
    position: relative;
}

.timeline-item.left .timeline-content {
    text-align: right;
    margin-right: auto; /* Push to left */
    padding-right: 30px;
}

.timeline-item.right .timeline-content {
    text-align: left;
    margin-left: auto; /* Push to right */
    padding-left: 30px;
}

.date-badge {
    display: inline-block;
    background: #D42426;
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
    margin-bottom: 15px;
    text-transform: capitalize;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.photo-card {
    background: white;
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.3s ease;
}

.photo-card:hover {
    transform: scale(1.02);
}

.photo-card img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    display: block;
}

.photo-caption {
    color: #333;
    margin-top: 10px;
    font-size: 0.95rem;
    font-style: italic;
    font-family: 'Manrope', sans-serif;
}

@media (max-width: 768px) {
    .timeline-line {
        left: 20px;
    }
    
    .timeline-item {
        margin-bottom: 40px;
    }

    .timeline-dot {
        left: 20px;
    }

    .timeline-content {
        width: 100%;
        padding-left: 50px !important;
        text-align: left !important;
    }
    
    .timeline-item.left .timeline-content {
        margin-right: 0;
    }
    
    .timeline-item.right .timeline-content {
        margin-left: 0;
    }
}
</style>
