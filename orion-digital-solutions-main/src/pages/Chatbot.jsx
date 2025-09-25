import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import DOMPurify from 'dompurify';
// Optional SDK import. Note: the SDK may not work in browser environments; fallback to REST is implemented below.
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Chatbot() {
  // Start with no pre-seeded system/assistant prompts so the AI behaves without a fixed persona
  const [messages, setMessages] = useState([]);
  const [archived, setArchived] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const refBottom = useRef(null);
  const chatScrollRef = useRef(null);
  const typingPlaceholderId = useRef(null);
  const revealAnimRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const userScrollTimerRef = useRef(null);
  // Debug flag: enable by visiting the app with ?debug=1
  const DEBUG_SCROLL = typeof window !== 'undefined' && (new URLSearchParams(window.location.search).get('debug') === '1');
  const [debugMetrics, setDebugMetrics] = useState({ scrollTop: 0, scrollHeight: 0, clientHeight: 0, nearBottom: false });
  // Local in-browser memory (lightweight) stored as array of { id, userText, assistantText, ts }
  const memoriesRef = useRef([]);
  const MEMORY_KEY = 'orionai_memories_v1';

  // Load memories from localStorage once
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MEMORY_KEY);
      if (raw) memoriesRef.current = JSON.parse(raw) || [];
    } catch (e) {
      memoriesRef.current = [];
    }
  }, []);

  // Helper: simple tokenizer
  const tokenize = (s) => String(s || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

  // Build term frequency map
  const tf = (tokens) => {
    const m = Object.create(null);
    for (const t of tokens) m[t] = (m[t] || 0) + 1;
    return m;
  };

  // Cosine similarity between two term-frequency maps
  const cosineSim = (a, b) => {
    let dot = 0, na = 0, nb = 0;
    for (const k in a) {
      na += a[k] * a[k];
      if (b[k]) dot += a[k] * b[k];
    }
    for (const k in b) nb += b[k] * b[k];
    if (na === 0 || nb === 0) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  };

  // Find best memory match for a query; returns {score, memory}
  const findBestMemory = (query) => {
    const qTokens = tokenize(query);
    const qtf = tf(qTokens);
    let best = { score: 0, memory: null };
    for (const mem of memoriesRef.current) {
      const mtokens = tokenize(mem.userText);
      const mtf = tf(mtokens);
      const s = cosineSim(qtf, mtf);
      if (s > best.score) best = { score: s, memory: mem };
    }
    return best;
  };

  // Return top N memories with their similarity scores
  const findTopMemories = (query, n = 3) => {
    const qTokens = tokenize(query);
    const qtf = tf(qTokens);
    const scored = [];
    for (const mem of memoriesRef.current) {
      const mtokens = tokenize(mem.userText);
      const mtf = tf(mtokens);
      const s = cosineSim(qtf, mtf);
      scored.push({ score: s, memory: mem });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, n);
  };

  // Format assistant raw text into tidy HTML: bullets, key-value pairs, paragraphs
  const formatAssistantOutput = (text) => {
    // Normalize input and aggressively clean markdown artifacts / stray asterisks
    let s = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    if (!s) return '';

    // Normalize common bullet characters to '-' (so later list detection works)
    s = s.replace(/^[\s]*[\*•]\s+/gm, '- ');
    // Convert headings (#) to bold lines
    s = s.replace(/^\s*#{1,6}\s*(.+)$/gm, (m, p1) => `**${p1.trim()}**`);
    // Convert inline code markers to <code>
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Convert bold **text** and italics *text* (inline)
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Only convert single-star italics where it's not a list marker (we normalized list markers)
    s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    // Remove sequences of 3 or more stars that may remain
    s = s.replace(/\*{3,}/g, '');
    // Remove stray leftover stars not part of formatting
    s = s.replace(/(^|\s)\*(?=\s|$)/g, ' ');

    const lines = s.split('\n').map(l => l.trim()).filter(Boolean);

    // If most lines start with '-' or '*' or a numbered list, render as list
    const bulletLines = lines.filter(l => /^([-*]|\d+\.)\s+/.test(l));
    if (bulletLines.length >= Math.max(2, Math.floor(lines.length * 0.5))) {
      // decide ordered vs unordered
      const ordered = bulletLines.every(l => /^\d+\./.test(l));
  const items = lines.map(l => l.replace(/^([-*]|\d+\.)\s+/, '')).map(s => `<li style="margin-bottom:12px">${s}</li>`).join('');
  // increase margin so visual newline looks wider
  return `<${ordered ? 'ol' : 'ul'} style="padding-left:18px;margin:22px 0 0 0;line-height:1.6">${items}</${ordered ? 'ol' : 'ul'}>`;
    }

    // If many lines are key: value, render definition list
    const kvLines = lines.filter(l => /^[^\s].*:\s*/.test(l));
    if (kvLines.length >= Math.max(2, Math.floor(lines.length * 0.4))) {
      const parts = kvLines.map(l => {
        const idx = l.indexOf(':');
        const key = l.slice(0, idx).trim();
        let val = l.slice(idx + 1).trim();
        // strip leading punctuation/bullets (e.g., '*', '-', '•') that sometimes follow ':'
        val = val.replace(/^[^\w\d]+/, '').trim();
        return `<dt style="font-weight:600;margin-top:16px">${key}</dt><dd style="margin:0 0 18px 14px">${val}</dd>`;
      }).join('');
      return `<dl style="margin:22px 0">${parts}</dl>`;
    }

    // Single key:value line (e.g., "Hidrasi: masih sama") -> render as bold label + value
    if (kvLines.length === 1 && lines.length === 1) {
      const l = kvLines[0];
      const idx = l.indexOf(':');
      const key = l.slice(0, idx).trim();
      let val = l.slice(idx + 1).trim();
      val = val.replace(/^[^\w\d]+/, '').trim();
  return `<p style="margin:22px 0"><strong>${key}</strong>: ${val}</p>`;
    }

    // If multiple short lines, present as a simple bulleted list
    const shortLines = lines.filter(l => l.length < 80);
    if (lines.length > 1 && shortLines.length === lines.length && lines.length <= 8) {
  const items = lines.map(s => `<li style="margin-bottom:12px">${s}</li>`).join('');
  return `<ul style="padding-left:18px;margin:22px 0 0 0;line-height:1.6">${items}</ul>`;
    }

    // Single-line with commas and short items -> convert to list
    if (lines.length === 1 && lines[0].includes(',') ) {
      const parts = lines[0].split(',').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2 && parts.every(p => p.length < 60)) {
  const items = parts.map(s => `<li style="margin-bottom:12px">${s}</li>`).join('');
  return `<ul style="padding-left:18px;margin:22px 0 0 0;line-height:1.6">${items}</ul>`;
      }
    }

    // Otherwise convert double line breaks into paragraphs and single newlines to <br>
  const cleaned = s.replace(/\*{2,}/g, '').replace(/\s{2,}/g, ' ').replace(/[\-]{3,}/g, '—');
  // Use larger paragraph margins so visual "newlines" appear farther apart (approx 3-4 empty lines)
  const paragraphs = cleaned.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => `<p style="margin:24px 0;line-height:1.6">${p.replace(/\n/g, '<br/>')}</p>`).join('');
  return paragraphs;
  };

  // Save a new memory (cap size)
  const saveMemory = (userText, assistantText) => {
    try {
      const entry = { id: `mem-${Date.now()}-${Math.floor(Math.random()*1000)}`, userText, assistantText, ts: Date.now() };
      memoriesRef.current.unshift(entry);
      // cap to 100 entries
      if (memoriesRef.current.length > 100) memoriesRef.current.length = 100;
      window.localStorage.setItem(MEMORY_KEY, JSON.stringify(memoriesRef.current));
    } catch (e) {
      // ignore storage errors
    }
  };

  useEffect(() => {
    try {
      const el = chatScrollRef.current;
      // Only auto-scroll if the user is already near the bottom (so we don't hijack when they scroll up)
      if (el) {
        // If the user is actively scrolling (recent onScroll), don't auto-scroll
        if (isUserScrollingRef.current) return;
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120; // 120px threshold
        if (nearBottom && refBottom.current && typeof refBottom.current.scrollIntoView === 'function') {
          refBottom.current.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (refBottom.current && typeof refBottom.current.scrollIntoView === 'function') {
        // fallback
        refBottom.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      // ignore in non-browser/test environments
    }
  }, [messages]);

  // Toggle history view based on scroll position: if user scrolls near the top, show history.
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el || typeof el.addEventListener !== 'function') return;
    if (!Array.isArray(archived) || archived.length === 0) return; // nothing to show as history

    let rafId = null;
    let lastState = null;

    const handle = () => {
      try {
        // mark that the user interacted with scroll; keep this true briefly so auto-scroll is suppressed
        isUserScrollingRef.current = true;
        if (userScrollTimerRef.current) clearTimeout(userScrollTimerRef.current);
        userScrollTimerRef.current = setTimeout(() => { isUserScrollingRef.current = false; userScrollTimerRef.current = null; }, 1500);
        const nearTop = el.scrollTop < 60;
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
        const next = nearTop ? true : nearBottom ? false : null;
        if (DEBUG_SCROLL) {
          console.log('[scroll] top=', el.scrollTop, 'height=', el.scrollHeight, 'client=', el.clientHeight, 'nearTop=', nearTop, 'nearBottom=', nearBottom);
          setDebugMetrics({ scrollTop: el.scrollTop, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, nearBottom });
        }
        // Only update if state would change
        if (next !== null && next !== lastState) {
          setShowHistory(next);
          lastState = next;
        }
      } catch (e) {
        // ignore
      }
      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return; // already scheduled
      rafId = requestAnimationFrame(handle);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (userScrollTimerRef.current) {
        clearTimeout(userScrollTimerRef.current);
        userScrollTimerRef.current = null;
      }
    };
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    // Capture current visible messages (before clearing) so we can include them in context
    const previousVisible = Array.isArray(messages) ? messages : [];
    // Archive the current visible messages so the screen becomes 'clean'
    setArchived(prev => [...prev, ...previousVisible]);

    const userMsg = { id: `user-${Date.now()}`, role: 'user', content: input };
    // Show only the user's message and a placeholder assistant message to focus the screen
    setMessages([userMsg]);
    setInput('');
    setLoading(true);
    // Insert a placeholder assistant message that will show a typing indicator
    const placeholderId = `assistant-${Date.now()}-${Math.floor(Math.random()*10000)}`;
    typingPlaceholderId.current = placeholderId;
    setMessages(prev => [...prev, { id: placeholderId, role: 'assistant', content: '' }]);

    // Helper: extract first string value from nested JSON response
    const extractTextFromAny = (obj) => {
      if (!obj) return null;
      if (typeof obj === 'string') return obj;
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const t = extractTextFromAny(item);
          if (t) return t;
        }
        return null;
      }
      if (typeof obj === 'object') {
        for (const k of Object.keys(obj)) {
          const t = extractTextFromAny(obj[k]);
          if (t) return t;
        }
      }
      return null;
    };

    

  const callGemini = async (promptText) => {
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
      if (!API_KEY) throw new Error('REACT_APP_GEMINI_API_KEY tidak diset. Tambahkan API key di environment atau gunakan proxy server.');

      // Use the REST endpoint for Generative Language
      const url = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.0-flash:generateText?key=${API_KEY}`;
      const body = {
        // Send the user's text verbatim as the prompt — no additional instructions
        prompt: { text: promptText },
        temperature: 0.1,
        maxOutputTokens: 512
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const contentType = res.headers.get('content-type') || '';
      const status = res.status;

      // If response not OK, read text to surface meaningful error (many dev-server / CORS misconfigs return HTML)
      const rawText = await res.text();
      if (!res.ok) {
        // Provide helpful hint if HTML returned (often indicates CORS or incorrect URL)
        const preview = rawText.slice(0, 800);
        throw new Error(`HTTP ${status} - Non-OK response. Content-Type: ${contentType}. Response snippet: ${preview}`);
      }

      // If content-type is JSON, parse and try to extract text
      if (contentType.includes('application/json') || contentType.includes('application/') ) {
        let data;
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          throw new Error('Response claimed JSON but could not parse it. Raw snippet: ' + rawText.slice(0, 800));
        }

        const extracted = extractTextFromAny(data) || JSON.stringify(data);
        return extracted;
      }

      // If not JSON (HTML etc.) return helpful error
      throw new Error('Received non-JSON response from Gemini (possible CORS or wrong endpoint). Snippet: ' + rawText.slice(0, 800));
    };

    try {
  // Use only the raw user input as the prompt (no history, no prompt-engineering wrappers)
  const promptText = userMsg.content;
      // Build context: include the last 5 previous messages directly for conversational continuity.
      // If there are more than 5 previous messages, use RAG (matching) for older context to stay efficient.
      let assistantText = null;
      let promptForApi = promptText; // default
      try {
        // Build prevHistory from archived + the visible messages we just captured so recent turns are included
        const prevHistory = [...(Array.isArray(archived) ? archived : []), ...previousVisible];
        const lastFive = prevHistory.slice(-5);
        // Compose direct conversation context from lastFive
        const convoCtx = lastFive.map(m => `${m.role}: ${m.content}`).join('\n');

        // If history is long, fetch top memory matches for older context
        let ragCtx = '';
        if (prevHistory.length > 5) {
          const top = findTopMemories(promptText, 3).filter(t => t.score > 0.28);
          if (top.length) {
            ragCtx = top.map(t => `user: ${t.memory.userText}\nassistant: ${t.memory.assistantText}`).join('\n---\n');
          }
        }

        // Very-high-similarity shortcut: reuse cached answer when appropriate
        const best = findBestMemory(promptText);
        if (best.memory && best.score > 0.88) {
          assistantText = best.memory.assistantText;
        } else {
          // Build minimal prompt: RAG matches (if any) + last 5 convo messages + current user query
          const parts = [];
          if (ragCtx) parts.push(ragCtx);
          if (convoCtx) parts.push(convoCtx);
          parts.push(`user: ${promptText}`);
          promptForApi = parts.join('\n---\n');
        }
      } catch (e) {
        // ignore memory errors
      }
      // Try SDK first (may fail in browser environments). If it works, use it; otherwise fallback to REST.
      try {
        if (!assistantText) {
        const genAI = new GoogleGenerativeAI("AIzaSyB9GeiZXHvcui45w4dWpESnpe3WxDk_wxo");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        if (model && typeof model.generateContent === 'function') {
          try {
            // Use promptForApi (which may include last-5 convo + RAG matches) so SDK sees the full context
            const sdkResult = await model.generateContent(promptForApi);
            // sdkResult may have a response stream or nested structure
            if (sdkResult?.response?.text) {
              assistantText = await sdkResult.response.text();
            } else if (typeof sdkResult === 'string') {
              assistantText = sdkResult;
            } else if (sdkResult?.candidates?.[0]?.content) {
              assistantText = sdkResult.candidates[0].content;
            }
          } catch (sdkErr) {
            // SDK call failed (likely not supported in browser) - we will fallback to REST
            console.warn('SDK call failed, falling back to REST:', sdkErr);
            assistantText = null;
          }
        }
        }
      } catch (e) {
        // Importing/instantiating SDK may fail in browser; ignore and fallback
        console.warn('Could not initialize SDK in this environment, falling back to REST', e);
      }

      if (!assistantText) {
        assistantText = await callGemini(promptForApi);
        // Save successful responses to memory (non-empty)
        try {
          if (assistantText && assistantText.trim()) saveMemory(promptText, assistantText);
        } catch (e) {
          // ignore
        }
      }
      // Smoothly reveal assistantText into the placeholder message we inserted earlier
      const messageId = typingPlaceholderId.current;
      if (messageId) {
        // Reveal text per-word for a very smooth read-like animation
        const full = String(assistantText || '');
        const words = full.split(/(\s+)/).filter(Boolean); // keep spaces as tokens so join preserves spacing
        const wordCount = words.length;
        // Faster per-word reveal: shorter per-word delay and tighter min/max bounds
        const minMs = 300;
        const maxMs = 2000;
        const msPerWord = 60; // faster, still readable
        const duration = Math.min(maxMs, Math.max(minMs, wordCount * msPerWord));
        const start = performance.now();

        if (revealAnimRef.current) {
          cancelAnimationFrame(revealAnimRef.current);
        }

        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const idx = Math.floor(t * wordCount);
          const visible = words.slice(0, idx).join('');
          setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: visible } : m));
          if (t < 1) {
            revealAnimRef.current = requestAnimationFrame(step);
          } else {
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: full } : m));
            typingPlaceholderId.current = null;
            revealAnimRef.current = null;
          }
        };

        revealAnimRef.current = requestAnimationFrame(step);
      } else {
        // Fallback: append normally
        setMessages(prev => [...prev, { role: 'assistant', content: assistantText }]);
      }
    } catch (err) {
      const msg = err?.message || String(err);
      // If the error mentions CORS or HTML, give explicit guidance
      let userMsg = 'Gagal memanggil Gemini: ' + msg;
      if (msg && msg.toLowerCase().includes('cors')) {
        userMsg += '\nKemungkinan masalah CORS — browser tidak diizinkan langsung memanggil API. Solusi: jalankan proxy server atau gunakan server-side request.';
      } else if (msg && msg.toLowerCase().includes('not set')) {
        userMsg += '\nTambahkan REACT_APP_GEMINI_API_KEY di .env (tidak direkomendasikan untuk produksi) atau gunakan proxy server yang menyimpan key di server.';
      } else if (msg && msg.startsWith('HTTP')) {
        userMsg += '\nPeriksa status dan respons. Jika Anda melihat HTML (<!DOCTYPE), biasanya itu menandakan request diarahkan ke halaman HTML lokal — periksa URL endpoint atau aturan proxy dev server.';
      }

      setMessages(prev => [...prev, { role: 'assistant', content: userMsg }]);
    } finally {
      // keep loading true until reveal completes; if no animation running, clear it
      // Wait until reveal animation finishes before clearing loading
      const waitForReveal = () => {
        if (!revealAnimRef.current) setLoading(false);
        else {
          const id = setInterval(() => {
            if (!revealAnimRef.current) {
              setLoading(false);
              clearInterval(id);
            }
          }, 120);
        }
      };
      waitForReveal();
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      overflow: 'hidden'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 4px 18px rgba(6,12,20,0.04)',
          borderBottom: '1px solid rgba(15,23,42,0.04)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#34d399,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>AI</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Modern AI Chat</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{loading ? 'Mengirim...' : 'Siap membantu'}</div>
            </div>
          </div>
          {DEBUG_SCROLL && (
            <div style={{ position: 'absolute', right: 18, top: 12, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px 10px', borderRadius: 8, fontSize: 12 }}>
              <div>scrollTop: {debugMetrics.scrollTop}</div>
              <div>scrollHeight: {debugMetrics.scrollHeight}</div>
              <div>clientH: {debugMetrics.clientHeight}</div>
              <div>nearBottom: {String(debugMetrics.nearBottom)}</div>
              <div>showHistory: {String(showHistory)}</div>
              <div>archived: {archived.length}</div>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: '#0b1220', fontWeight: 600 }}>orionai</div>
          </div>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, display: 'flex', background: 'transparent' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 28px', boxSizing: 'border-box', height: '100%' }}>
              <div
                style={{
                  flex: 1,
                  height: '100%',
                  overflow: 'auto',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'auto',
                  touchAction: 'auto',
                  pointerEvents: 'auto',
                  paddingBottom: 18
                }}
                ref={chatScrollRef}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {(showHistory ? [...archived, ...messages] : messages).map((m, i) => {
                    const raw = String(m.content || '');
                    // Try to detect JSON and pretty-print it for readability
                    let isJson = false;
                    let pretty = '';
                    try {
                      const t = raw.trim();
                      if (t.startsWith('{') || t.startsWith('[')) {
                        const parsed = JSON.parse(t);
                        pretty = JSON.stringify(parsed, null, 2);
                        isJson = true;
                      }
                    } catch (e) {
                      isJson = false;
                    }
                    const safe = DOMPurify.sanitize(isJson ? pretty : raw);

                    return (
                      <motion.div
                        key={m.id || i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.32, ease: [0.2,0.85,0.25,1] }}
                        style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 14 }}
                      >
                        <div style={{ width: '100%' }}>
                          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6, textTransform: 'capitalize' }}>{m.role === 'assistant' ? 'orionai' : 'Anda'}</div>
                          {m.role === 'assistant' ? (
                            // Assistant: visually blend with background (no visible bubble)
                            <div style={{
                              width: '100%',
                              background: 'transparent',
                              color: '#061328',
                              padding: '14px 18px',
                              borderRadius: 0,
                              boxShadow: 'none',
                              boxSizing: 'border-box'
                            }}>
                              {(!m.content || m.content === '') && loading ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                                  <motion.div style={{ width: 8, height: 8, borderRadius: 99, background: '#cbd5e1' }} animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.05 }} />
                                  <motion.div style={{ width: 8, height: 8, borderRadius: 99, background: '#cbd5e1' }} animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.05, delay: 0.12 }} />
                                  <motion.div style={{ width: 8, height: 8, borderRadius: 99, background: '#cbd5e1' }} animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.05, delay: 0.24 }} />
                                  <div style={{ marginLeft: 8, color: '#6b7280', fontSize: 13 }}>Mengetik…</div>
                                </div>
                              ) : (
                                isJson ? (
                                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace', fontSize: 16, background: 'transparent', color: '#061328' }} dangerouslySetInnerHTML={{ __html: safe }} />
                                ) : (
                                  <div style={{ fontSize: 18 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatAssistantOutput(raw) || safe) }} />
                                )
                              )}
                            </div>
                          ) : (
                            // User bubble (right)
                            <div style={{
                              display: 'inline-block',
                              background: 'linear-gradient(90deg,#60a5fa,#3b82f6)',
                              color: 'white',
                              padding: '10px 14px',
                              borderRadius: '12px 12px 0 12px',
                              boxShadow: '0 8px 26px rgba(59,130,246,0.14)',
                              maxWidth: '76%'
                            }} dangerouslySetInnerHTML={{ __html: safe }} />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={refBottom} />
              </div>

              {/* Input area */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 12, background: 'transparent' }}>
                <motion.input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') send(); }}
                  placeholder="Tulis pesan..."
                  whileFocus={{ scale: 1.01 }}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    borderRadius: 999,
                    border: '1px solid rgba(14,30,37,0.06)',
                    outline: 'none',
                    background: 'linear-gradient(180deg, rgba(246,249,252,0.9), rgba(241,244,249,0.85))',
                    color: '#061328',
                    boxShadow: 'inset 0 1px 2px rgba(6,12,20,0.02)'
                  }}
                />
                <motion.button
                  onClick={send}
                  whileTap={{ scale: 0.96 }}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(90deg,#06b6d4,#3b82f6)',
                    borderRadius: 999,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 8px 20px rgba(59,130,246,0.18)'
                  }}
                >
                  <FiSend size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
