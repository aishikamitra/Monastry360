(function() {
  const root = document.querySelector('[data-monastery-chatbot]');
  if (!root) return;

  const endpoint = root.dataset.endpoint || window.MONASTERY_BOT_ENDPOINT || '/predict';
  const panel = root.querySelector('[data-chatbot-window]');
  const closeBtn = root.querySelector('[data-chatbot-close]');
  const messagesEl = root.querySelector('[data-chatbot-messages]');
  const typingEl = root.querySelector('[data-chatbot-typing]');
  const inputEl = root.querySelector('[data-chatbot-input]');
  const sendBtn = root.querySelector('[data-chatbot-send]');
  const suggestions = root.querySelectorAll('[data-chatbot-suggestion]');

  const scrollToBottom = () => {
    if (!messagesEl) return;
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
  };

  const createMessage = (text, author) => {
    const wrapper = document.createElement('div');
    const isUser = author === 'user';
    wrapper.className = `flex gap-3 ${isUser ? 'justify-end' : ''}`;

    const avatar = document.createElement('div');
    avatar.className = `shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900' : 'bg-slate-900/80 text-white shadow-lg'}`;
    avatar.innerHTML = isUser ? '<span class="font-semibold">You</span>' : '<i class="fa-solid fa-temple-buddhist"></i>';

    const bubble = document.createElement('div');
    bubble.className = `max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isUser ? 'bg-gradient-to-br from-orange-200 via-amber-100 to-orange-50 text-slate-900 rounded-br-sm' : 'bg-white/90 backdrop-blur border border-amber-100/60 rounded-bl-sm text-slate-700'}`;
    bubble.textContent = text;

    if (isUser) {
      wrapper.appendChild(bubble);
      wrapper.appendChild(avatar);
    } else {
      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
    }

    return wrapper;
  };

  const setTyping = (visible) => {
    if (!typingEl) return;
    typingEl.style.display = visible ? 'flex' : 'none';
    if (visible) scrollToBottom();
  };

  const sendMessage = async () => {
    if (!inputEl || !messagesEl) return;
    const text = inputEl.value.trim();
    if (!text) return;

    messagesEl.appendChild(createMessage(text, 'user'));
    inputEl.value = '';
    scrollToBottom();
    setTyping(true);
    sendBtn.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const answer = data.answer || 'I do not understand...';
      messagesEl.appendChild(createMessage(answer, 'bot'));
    } catch (error) {
      console.error('Chatbot error:', error);
      messagesEl.appendChild(createMessage('I am unable to connect right now. Please try again in a moment.', 'bot'));
    } finally {
      setTyping(false);
      sendBtn.disabled = false;
      scrollToBottom();
    }
  };

  suggestions.forEach(button => {
    button.addEventListener('click', () => {
      if (!inputEl) return;
      inputEl.value = button.dataset.value || button.textContent.trim();
      sendMessage();
    });
  });

  sendBtn?.addEventListener('click', sendMessage);
  inputEl?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  const openPanel = () => {
    panel?.setAttribute('data-open', 'true');
    setTimeout(() => inputEl?.focus(), 120);
  };

  const closePanel = () => {
    panel?.setAttribute('data-open', 'false');
  };

  toggle?.addEventListener('click', () => {
    const isOpen = panel?.getAttribute('data-open') === 'true';
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn?.addEventListener('click', closePanel);

  document.addEventListener('click', (event) => {
    if (!panel || panel.getAttribute('data-open') !== 'true') return;
    if (!panel.contains(event.target) && !toggle.contains(event.target)) {
      closePanel();
    }
  });

  setTyping(false);
})();
