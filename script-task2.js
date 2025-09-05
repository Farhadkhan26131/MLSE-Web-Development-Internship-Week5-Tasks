document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('image-gallery');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const loadMoreBtn = document.getElementById('load-more');
    const loader = document.getElementById('loader');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeModal = document.getElementById('close-modal');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let currentPage = 1;
    let currentQuery = 'nature';
    let isLoading = false;
    
    // Initialize with nature images
    fetchImages(currentQuery);
    
    // Fetch images from Unsplash API
    async function fetchImages(query, page = 1) {
        if (isLoading) return;
        
        isLoading = true;
        loader.style.display = 'block';
        if (page === 1) {
            gallery.innerHTML = '';
        }
        
        try {
            // In a real implementation, you would use your Unsplash API key
            // const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=12&client_id=YOUR_ACCESS_KEY`);
            
            // For demo purposes, we'll use a mock API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock data - in a real app, this would come from the API response
            const mockData = generateMockImages(query, page);
            
            displayImages(mockData);
            
            if (page === 1) {
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            gallery.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load images. Please try again later.</p>
                </div>
            `;
        } finally {
            isLoading = false;
            loader.style.display = 'none';
        }
    }
    
    // Generate mock images for demonstration
    function generateMockImages(query, page) {
        const images = [];
        const startIndex = (page - 1) * 12;
        
        for (let i = 1; i <= 12; i++) {
            const id = startIndex + i;
            images.push({
                id: id,
                urls: {
                    regular: `https://picsum.photos/800/600?random=${id}&query=${query}`,
                    small: `https://picsum.photos/400/300?random=${id}&query=${query}`
                },
                user: {
                    name: `User ${id}`,
                    profile_image: `https://i.pravatar.cc/100?img=${id % 70}`
                },
                description: `Beautiful ${query} image #${id}`,
                alt_description: `${query} photography`
            });
        }
        
        return { results: images };
    }
    
    // Display images in the gallery
    function displayImages(data) {
        if (data.results.length === 0) {
            gallery.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No images found for "${currentQuery}". Try a different search.</p>
                </div>
            `;
            return;
        }
        
        data.results.forEach(image => {
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            imageCard.innerHTML = `
                <img src="${image.urls.small}" alt="${image.alt_description}" class="image" data-id="${image.id}" data-full="${image.urls.regular}">
                <div class="image-info">
                    <div class="image-user">
                        <img src="${image.user.profile_image}" alt="${image.user.name}" class="user-avatar">
                        <span class="user-name">${image.user.name}</span>
                    </div>
                    <p class="image-desc">${image.description || 'Beautiful image'}</p>
                </div>
            `;
            gallery.appendChild(imageCard);
        });
        
        // Set up lazy loading with Intersection Observer
        setupLazyLoading();
        
        // Set up image click events
        setupImageClicks();
    }
    
    // Set up lazy loading for images
    function setupLazyLoading() {
        const images = document.querySelectorAll('.image');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src || image.src;
                        image.classList.add('loaded');
                        imageObserver.unobserve(image);
                    }
                });
            });
            
            images.forEach(image => {
                imageObserver.observe(image);
            });
        }
    }
    
    // Set up click events for images
    function setupImageClicks() {
        const images = document.querySelectorAll('.image');
        
        images.forEach(image => {
            image.addEventListener('click', () => {
                openModal(image.dataset.full, image.alt);
            });
        });
    }
    
    // Open modal with full-size image
    function openModal(imageSrc, imageAlt) {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modalTitle.textContent = imageAlt;
        modalDescription.textContent = 'Beautiful high-resolution image';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModalHandler() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners
    searchBtn.addEventListener('click', () => {
        if (searchInput.value.trim()) {
            currentQuery = searchInput.value.trim();
            currentPage = 1;
            fetchImages(currentQuery);
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            currentQuery = searchInput.value.trim();
            currentPage = 1;
            fetchImages(currentQuery);
        }
    });
    
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        fetchImages(currentQuery, currentPage);
    });
    
    closeModal.addEventListener('click', closeModalHandler);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentQuery = btn.dataset.filter;
            currentPage = 1;
            fetchImages(currentQuery);
        });
    });
    
    // Initial images for demo
    setTimeout(() => {
        const mockData = generateMockImages('nature', 1);
        displayImages(mockData);
        loader.style.display = 'none';
    }, 1000);
});