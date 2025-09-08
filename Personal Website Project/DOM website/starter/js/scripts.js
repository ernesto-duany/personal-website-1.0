(function () {
	const VALID_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const ILLEGAL_RE = /[^a-zA-Z0-9@._-]/;
	const MAX_MESSAGE = 300;

	let projectsData = [];
	let currentProjectIndex = 0;

	let emailInput, messageInput, form, emailError, messageError, charsLeftEl;
	let aboutMeContainer, projectList, projectSpotlight, spotlightTitles;
	let arrowLeft, arrowRight;


	function initializeElements() {
		emailInput = document.getElementById('contactEmail');
		messageInput = document.getElementById('contactMessage');
		form = document.getElementById('formSection');
		emailError = document.getElementById('emailError');
		messageError = document.getElementById('messageError');
		charsLeftEl = document.getElementById('charactersLeft');
		
		aboutMeContainer = document.getElementById('aboutMe');
		projectList = document.getElementById('projectList');
		projectSpotlight = document.getElementById('projectSpotlight');
		spotlightTitles = document.getElementById('spotlightTitles');
		arrowLeft = document.querySelector('.arrow-left');
		arrowRight = document.querySelector('.arrow-right');
	}

	async function populateAboutMe() {
		try {
			const response = await fetch('/DOM website/starter/data/aboutMeData.json');
			const data = await response.json();
			
			const paragraph = document.createElement('p');
			paragraph.textContent = data.aboutMe;
			
			const headshotContainer = document.createElement('div');
			headshotContainer.className = 'headshotContainer';
			
			const headshotImg = document.createElement('img');
			headshotImg.src = "/DOM website/starter/images/pfp.jpeg";
			headshotImg.alt = 'Professional headshot';
			headshotImg.width = 200;
			headshotImg.height = 200;
			
			headshotContainer.appendChild(headshotImg);
			
			aboutMeContainer.appendChild(paragraph);
			aboutMeContainer.appendChild(headshotContainer);
		} catch (error) {
			console.error('Error loading about me data:', error);
			const fallbackP = document.createElement('p');
			fallbackP.textContent = "Welcome to my portfolio! I'm a passionate developer creating amazing web experiences.";
			aboutMeContainer.appendChild(fallbackP);
		}
	}

	//  PROJECTS SECTION 
	async function populateProjects() {
		try {
			console.log('Attempting to load projectData.json...');
			const response = await fetch('/DOM website/starter/data/projectsData.json'); 
			console.log('Response status:', response.status);
			console.log('Response OK:', response.ok);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const text = await response.text();
			console.log('Raw response text:', text.substring(0, 200) + '...');
			
			projectsData = JSON.parse(text);
			console.log('Projects data loaded successfully:', projectsData.length, 'projects');
			console.log('First project:', projectsData[0]);
			
			createProjectCards();
			updateSpotlight(0);
			setupProjectNavigation();
			
		} catch (error) {
			console.error('Error loading projects data:', error);
			projectsData = [
				{
					project_id: 'project_personal',
					project_name: 'Personal Website',
					short_description: 'Showcase your skills and projects.',
					long_description: 'Build a website to highlight your programming abilities, experience, and portfolio. This is a great way to showcase your work to potential employers.',
					card_image: 'https://via.placeholder.com/200x200/2D3748/FFFFFF?text=Personal+Site',
					spotlight_image: 'https://via.placeholder.com/800x600/2D3748/FFFFFF?text=Personal+Website+Spotlight',
					url: 'https://example.com/project1'
				},
				{
					project_id: 'project_todo',
					project_name: 'To-Do List App',
					short_description: 'Organize your tasks efficiently.',
					long_description: 'Create a web or mobile app to help users manage their tasks, set deadlines, and prioritize their workload. This project is a good introduction to frontend development and basic backend logic.',
					card_image: 'https://via.placeholder.com/200x200/4A5568/FFFFFF?text=Todo+App',
					spotlight_image: 'https://via.placeholder.com/800x600/4A5568/FFFFFF?text=Todo+App+Spotlight',
					url: 'https://example.com/project2'
				},
				{
					project_id: 'project_calculator',
					project_name: 'Simple Calculator',
					short_description: 'Build a basic calculator.',
					long_description: 'Develop a web-based or mobile calculator that can perform basic arithmetic operations. This project is a good starting point for learning fundamental programming concepts and user interface design.',
					card_image: 'https://via.placeholder.com/200x200/718096/FFFFFF?text=Calculator',
					spotlight_image: 'https://via.placeholder.com/800x600/718096/FFFFFF?text=Calculator+Spotlight',
					url: 'https://example.com/project3'
				},
				{
					project_id: 'project_store',
					project_name: 'E-commerce Store',
					short_description: 'Online shopping platform.',
					long_description: 'Build a simple e-commerce website or app to sell products. This project involves frontend development, backend logic, and potentially database integration.',
					card_image: 'https://via.placeholder.com/200x200/A0AEC0/000000?text=E-commerce',
					spotlight_image: 'https://via.placeholder.com/800x600/A0AEC0/000000?text=E-commerce+Spotlight',
					url: 'https://example.com/project4'
				}
			];
			
			createProjectCards();
			updateSpotlight(0);
			setupProjectNavigation();
		}
	}

	function createProjectCards() {
		if (!projectList) return;
		
		projectList.innerHTML = ''; 
		
		projectsData.forEach((project, index) => {
			const card = document.createElement('div');
			card.className = 'projectCard';
			card.id = project.project_id;
			
			const cardImage = project.card_image || 'https://via.placeholder.com/200x200/666666/FFFFFF?text=Project';
			card.style.backgroundImage = `url(${cardImage})`;
			card.style.backgroundSize = 'cover';
			card.style.backgroundPosition = 'center';

			const fragment = document.createDocumentFragment();

			const titleEl = document.createElement('h4');
			titleEl.textContent = project.project_name;
			fragment.appendChild(titleEl);

			const descEl = document.createElement('p');
			descEl.textContent = project.short_description || '';
			fragment.appendChild(descEl);

			card.appendChild(fragment);
			
			card.addEventListener('click', () => {
				updateSpotlight(index);
				updateActiveCard(index);
			});
			
			projectList.appendChild(card);
		});
		
		updateActiveCard(0);
	}

	function updateSpotlight(index) {
		if (index < 0 || index >= projectsData.length || !projectSpotlight || !spotlightTitles) return;
		
		currentProjectIndex = index;
		const project = projectsData[index];
		
		const spotlightImage = project.spotlight_image || 'https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Featured+Project';
		projectSpotlight.style.backgroundImage = `url(${spotlightImage})`;
		projectSpotlight.style.backgroundSize = 'cover';
		projectSpotlight.style.backgroundPosition = 'center';
		
		spotlightTitles.innerHTML = '';
		const fragment = document.createDocumentFragment();

		const titleEl = document.createElement('h3');
		titleEl.textContent = project.project_name;
		fragment.appendChild(titleEl);

		const descEl = document.createElement('p');
		descEl.textContent = project.long_description;
		fragment.appendChild(descEl);

		if (project.url) {
			const linkEl = document.createElement('a');
			linkEl.href = project.url;
			linkEl.target = "_blank";
			linkEl.style.color = "#4A90E2";
			linkEl.textContent = "Click here to see more...";
			fragment.appendChild(linkEl);
		}

		spotlightTitles.appendChild(fragment);
	}

	function updateActiveCard(index) {
		const allCards = document.querySelectorAll('.projectCard');
		allCards.forEach(card => {
			card.classList.remove('active');
			card.classList.add('inactive');
		});
		
		if (allCards[index]) {
			allCards[index].classList.add('active');
			allCards[index].classList.remove('inactive');
		}
	}

	function setupProjectNavigation() {
		if (!arrowLeft || !arrowRight) return;
		
		arrowLeft.addEventListener('click', () => {
			scrollProjects('left');
		});
		
		arrowRight.addEventListener('click', () => {
			scrollProjects('right');
		});
	}

	function scrollProjects(direction) {
		if (!projectList) return;
		
		const scrollAmount = 220; 
		const isDesktop = window.innerWidth >= 1024;
		
		if (isDesktop) {
			if (direction === 'left') { 
				projectList.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
			} else { 
				projectList.scrollBy({ top: scrollAmount, behavior: 'smooth' });
			}
		} else {
			if (direction === 'left') {
				projectList.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
			} else {
				projectList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
			}
		}
	}

	//  FORM VALIDATION 
	function setupFormValidation() {
		if (!messageInput || !emailInput || !form) return;
		
		updateChars();
		
		messageInput.addEventListener('input', () => {
			updateChars();
			validateMessageRealTime();
		});

		emailInput.addEventListener('input', () => {
			validateEmailRealTime();
		});

		form.addEventListener('submit', (ev) => {
			ev.preventDefault();
			handleFormSubmit();
		});
	}

	function updateChars() {
		if (!messageInput || !charsLeftEl) return;
		
		const used = messageInput.value.length;
		charsLeftEl.textContent = `Characters: ${used}/${MAX_MESSAGE}`;
		
		if (used > MAX_MESSAGE) {
			charsLeftEl.style.color = 'red';
		} else {
			charsLeftEl.style.color = '';
		}
	}

	function validateEmailRealTime() {
		if (!emailError || !emailInput) return;
		
		const emailVal = (emailInput.value || '').trim();
		
		if (emailVal === '') {
			emailError.textContent = '';
		} else if (ILLEGAL_RE.test(emailVal)) {
			emailError.textContent = 'Email contains illegal characters. Only letters, numbers, @, ., _, and - are allowed.';
		} else if (!VALID_EMAIL_RE.test(emailVal)) {
			emailError.textContent = 'Please enter a valid email address (e.g., user@example.com).';
		} else {
			emailError.textContent = '';
		}
	}

	function validateMessageRealTime() {
		if (!messageError || !messageInput) return;
		
		const msgVal = messageInput.value || '';
		
		if (ILLEGAL_RE.test(msgVal)) {
			messageError.textContent = 'Message contains illegal characters. Only letters, numbers, @, ., _, and - are allowed.';
		} else if (msgVal.length > MAX_MESSAGE) {
			messageError.textContent = 'Message too long.';
		} else {
			messageError.textContent = '';
		}
	}

	function handleFormSubmit() {
		let isValid = true;
		
		if (emailError) emailError.textContent = '';
		if (messageError) messageError.textContent = '';

		const emailVal = (emailInput.value || '').trim();
		const msgVal = (messageInput.value || '').trim();

		if (!emailVal) {
			if (emailError) emailError.textContent = 'Email address is required.';
			isValid = false;
		} else if (ILLEGAL_RE.test(emailVal)) {
			if (emailError) emailError.textContent = 'Email contains illegal characters. Only letters, numbers, @, ., _, and - are allowed.';
			isValid = false;
		} else if (!VALID_EMAIL_RE.test(emailVal)) {
			if (emailError) emailError.textContent = 'Please enter a valid email address (e.g., user@example.com).';
			isValid = false;
		}

		if (!msgVal) {
			if (messageError) messageError.textContent = 'Message is required.';
			isValid = false;
		} else if (ILLEGAL_RE.test(msgVal)) {
			if (messageError) messageError.textContent = 'Message contains illegal characters. Only letters, numbers, @, ., _, and - are allowed.';
			isValid = false;
		} else if (msgVal.length > MAX_MESSAGE) {
			if (messageError) messageError.textContent = 'Message too long.';
			isValid = false;
		}

		if (isValid) {
			alert('Form submitted successfully — validation passed.');
			form.reset();
			updateChars();
		}
	}

	// ARROW STYLING ISSUE FIX
	function fixArrowStyling() {
		const style = document.createElement('style');
		style.textContent = `
			.arrow-right::before,
			.arrow-left::before {
				content: '';
				display: inline-block;
				width: 0;
				height: 0;
			}
			
			.arrow-right::before {
				border-top: 10px solid transparent;
				border-bottom: 10px solid transparent;
				border-left: 20px solid var(--onLightBG);
				margin-left: 5px;
			}
			
			.arrow-left::before {
				border-top: 10px solid transparent;
				border-bottom: 10px solid transparent;
				border-right: 20px solid var(--onLightBG);
				margin-right: 5px;
			}
		`;
		document.head.appendChild(style);
	}

	function init() {
		initializeElements();
		populateAboutMe();
		populateProjects();
		setupFormValidation();
		fixArrowStyling();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();