(() => {
  const STORAGE_KEY = 'mealRecords_v1';

  const form = document.getElementById('mealForm');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const typeInput = document.getElementById('type');
  const nameInput = document.getElementById('name');
  const calInput = document.getElementById('cal');
  const memoInput = document.getElementById('memo');

  const listEl = document.getElementById('list');
  const emptyMsg = document.getElementById('emptyMsg');
  const countEl = document.getElementById('count');

  const nowValues = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const MM = String(d.getMinutes()).padStart(2, '0');
    return { date: `${yyyy}-${mm}-${dd}`, time: `${HH}:${MM}` };
  };


  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };
  const save = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));


  let records = load();

  const setDefaultDateTime = () => {
    const { date, time } = nowValues();
    if (!dateInput.value) dateInput.value = date;
    if (!timeInput.value) timeInput.value = time;
  };

  const render = () => {
    listEl.innerHTML = '';

    if (records.length === 0) {
      emptyMsg.style.display = 'block';
      countEl.textContent = '0件';
      return;
    }

    emptyMsg.style.display = 'none';

   
    const sorted = [...records].sort((a, b) => {
      const ad = `${a.date} ${a.time}`;
      const bd = `${b.date} ${b.time}`;
      return bd.localeCompare(ad);
    });

    for (const r of sorted) {
      const li = document.createElement('li');
      li.className = 'item';

      const left = document.createElement('div');

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = `${r.type}：${r.name}（${r.cal} kcal）`;
      left.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${r.date} ${r.time} / ID:${r.id}`;
      left.appendChild(meta);

      if (r.memo) {
        const memo = document.createElement('div');
        memo.className = 'memo';
        memo.textContent = `メモ：${r.memo}`;
        left.appendChild(memo);
      }

      const ops = document.createElement('div');
      ops.className = 'ops';

      const delBtn = document.createElement('button');
      delBtn.textContent = '削除';
      delBtn.className = 'danger';
      delBtn.addEventListener('click', () => {

        records = records.filter(x => x.id !== r.id);
        save(records);
        render();
      });

      ops.appendChild(delBtn);

      li.appendChild(left);
      li.appendChild(ops);
      listEl.appendChild(li);
    }

    countEl.textContent = `${records.length}件`;
  };


  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const calStr = calInput.value.trim();
    const cal = Number(calStr);

    if (!name) {
      alert('メニュー名を入力してください。');
      nameInput.focus();
      return;
    }
    if (calStr === '' || isNaN(cal) || cal < 0) {
      alert('カロリーは0以上の数値で入力してください。');
      calInput.focus();
      return;
    }


    const d = dateInput.value || nowValues().date;
    const t = timeInput.value || nowValues().time;

    const rec = {
      id: Date.now(),       
      date: d,
      time: t,
      type: typeInput.value,
      name,
      cal,
      memo: memoInput.value.trim()
    };

    records.push(rec);

    save(records);

    render();

 
    form.reset();
    setDefaultDateTime();
    nameInput.focus();
  });


  setDefaultDateTime();
  render();
})();
