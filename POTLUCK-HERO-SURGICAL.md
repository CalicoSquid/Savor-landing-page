# Potluck Web — surgical hero pass

Scope: hero / post-spin viewport only. Everything below the hero is unchanged from `site-potluck-web-tightened-v2`.

Changes:
- Removed the hero concentric-circle illustration; retained the Potluck dotted field.
- Removed the idle subline/tagline. Hero is now wordmark → one Universe phrase → wheel → flat dark-teal Spin button → live counter.
- Simplified Spin to a flat dark-teal CTA with no 3D shadow/decorative icon furniture.
- Mobile hero fills the dynamic viewport below the fixed 64px nav (`100dvh`, guarded by `100svh`) and scales wordmark/wheel/type/gaps by viewport height.
- Revealed state hides the now-redundant idle phrase on mobile and scales the result to remain in the same viewport.
- Result metadata is a single non-wrapping row with at most two pills: time + one cuisine/category value.
- Removed the inline Savor nudge beneath a landed recipe.
- Ghost/share result actions are opaque so the hero dots do not show through them.
