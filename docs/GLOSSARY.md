# AXIS product glossary

Canonical terminology for future AXIS localization. These terms define product meaning; individual UI strings may use shorter natural phrasing when space/context requires it.

Translations must be reviewed in context. `zh-Hant` is not produced by mechanically converting `zh-Hans`, and English is not a word-for-word mirror of Chinese syntax.

| Concept | `zh-Hans` 简体中文 | `zh-Hant` 繁體中文 | `en` English | Meaning / usage |
| --- | --- | --- | --- | --- |
| AXIS | AXIS | AXIS | AXIS | Product name; never translate. |
| Personal Evolution Engine | 个人演变引擎 | 個人演變引擎 | Personal Evolution Engine | Product identity; primarily documentation/positioning, not repeated UI copy. |
| Training | 训练 | 訓練 | Training | A real practice/training activity. |
| Session | 训练记录 / 本次训练 | 訓練記錄 / 本次訓練 | Session | A bounded real training/practice session; choose natural UI copy by context. |
| Encounter | 记录 | 記錄 | Encounter | A factual occurrence bound to an object/time/evidence. Internal domain term may remain `Encounter`. |
| Capture | 拍摄 | 拍攝 | Capture | Canonical camera/media entry. Not synonymous with Scan. |
| Photo | 照片 | 照片 | Photo | Still image capture/import. |
| Video | 视频 | 影片 | Video | Explicit video recording. |
| Scan | 扫描 | 掃描 | Scan | Short repeated sampling mode; not video duration selection. |
| Scan sampling | 扫描取样 | 掃描取樣 | Scan sampling | Exactly the sampling behavior whose preference currently exposes 3秒 / 5秒. |
| 3 seconds | 3秒 | 3秒 | 3 sec | Scan sampling duration. |
| 5 seconds | 5秒 | 5秒 | 5 sec | Scan sampling duration. |
| Quick Record | 快速记录 | 快速記錄 | Quick Record | Low-friction factual recording path. |
| Supplemental capture | 补拍照片 / 视频 | 補拍照片 / 影片 | Add photo / video | One supplemental Evidence entry from Quick Record; do not resurrect historical 3/5 capture-mode choices. |
| Evidence | 影像证据 | 影像證據 | Evidence | Factual media attached to real Encounters; not an AI progress verdict. |
| Comparative Evidence | 对照影像 | 對照影像 | Comparative Evidence | Factual side-by-side/in-place comparison of Encounter evidence. |
| Start | 起点 | 起點 | Start | Named left comparison slot in the current comparison model. |
| Compare | 对照 | 對照 | Compare | Named active/right comparison slot; avoid translating as a score or judgment. |
| Evolution | 演变 | 演變 | Evolution | Observable change accumulated from factual Encounters over time. Not a synthetic fitness score. |
| Evolution Object | 演变对象 | 演變物件 | Evolution Object | Stable object identity formed from repeated reality. Internal/product concept; UI wording may be simplified. |
| Evolution Library | 演变库 | 演變資料庫 | Evolution Library | Derived read-only shelf/library of repeated objects; not a second persistence database. |
| History | 历史 | 歷史 | History | Recorded factual history. |
| Details | 详情 | 詳情 | Details | Encounter/session detail surface. |
| Settings | 设置 | 設定 | Settings | Product preferences. |
| Data & archive | 资料与收纳 | 資料與收納 | Data & archive | Current storage/archive surface concept. |
| Equipment | 器械 | 器材 | Equipment | Training equipment/object; exact UI noun may depend on object domain. |
| Custom object | 自定义项目 | 自訂項目 | Custom object | User-defined equipment/sport/movement object; avoid exposing schema jargon to ordinary users. |
| Metrics | 记录指标 | 記錄指標 | Metrics | Fields that an object actually tracks. |
| Weight | 重量 | 重量 | Weight | A metric only when the object schema declares it. |
| Repetitions | 次数 | 次數 | Reps | A metric only when declared by schema. |
| Sets | 组数 | 組數 | Sets | A metric only when declared by schema. |
| Duration | 时长 | 時長 | Duration | Time spent; distinct from estimated target time. |
| Estimated target | 预计目标时间 | 預計目標時間 | Estimated target | Reminder boundary, never factual completion. |
| Complete | 完成 | 完成 | Complete | User-confirmed completion/factual state, not inferred from reaching target time. |
| Save | 保存 | 儲存 | Save | Persist/export depending on context; translation key should distinguish those actions internally. |
| Delete record | 删除记录 | 刪除記錄 | Delete record | Removes the Encounter and corresponding owned media according to current contract. |
| Export | 导出 | 匯出 | Export | Save media/data outside the AXIS local store. |
| Front camera | 前置摄像头 | 前置相機 | Front camera | User-facing camera direction. |
| Rear camera | 后置摄像头 | 後置相機 | Rear camera | User-facing camera direction. |
| Follow system | 跟随系统 | 跟隨系統 | System | Theme follows OS/browser preference. |
| Light | 浅色 | 淺色 | Light | Light app theme. |
| Dark | 深色 | 深色 | Dark | Dark app theme. |
| Simplified Chinese | 简体中文 | 簡體中文 | Simplified Chinese | Locale id `zh-Hans`. UI content under this locale must use Simplified Chinese. |
| Traditional Chinese | 繁体中文 | 繁體中文 | Traditional Chinese | Locale id `zh-Hant`. |
| English | 英文 | 英文 | English | Locale id `en`. |

## Writing rules

- Prefer concrete, ordinary product language over slogans or literary copy.
- Keep factual terms distinct: target/reminder is not completion; Evidence is not a score; Scan is not Video.
- Do not expose internal ownership/version identifiers (`v876`, `v8710`, `metricSchemaSnapshot`) in ordinary UI.
- Use locale-native punctuation/spacing and natural sentence order.
- When regional vocabulary differs, prefer the term that is clearest to the target locale and preserve the same product concept key underneath.
- Any new core product term should be added here before it spreads across three locale files.
