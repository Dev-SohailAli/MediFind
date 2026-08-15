# Claude design proposal protocol

## Purpose

Claude may propose an interface design that implements MediFind’s approved product, safety, accessibility, language and architecture requirements. It is a design collaborator, not an authority to change product policy. A design proposal is reviewed by the founder/documentation agent before Claude writes the affected UI code.

## Required proposal contents

For each visual/UI task, Claude creates a concise design proposal linked to the task brief containing:

- target role, user outcome, relevant journeys and non-goals;
- screen/flow map including loading, offline, empty, stale, permission, error, security and success states;
- component hierarchy and semantic design-token use; proposed colour/typography/spacing/icon decisions or clearly labelled alternatives;
- accessibility behaviour: 200% scaling, VoiceOver/TalkBack semantics/focus, contrast, touch targets, non-colour status and motion handling;
- English, iTaukei and Fiji Hindi content/layout implications, including the boundary between translated system content and language-tagged pharmacy text;
- prescription/reservation/privacy/notification safety constraints where relevant;
- any new asset, permission, library, data field, processor, cost or policy implication; and
- a validation plan, including synthetic states/screens and required tests.

For a substantial flow, Claude should provide a low-fidelity screen/wireframe description or other reviewable visual representation before high-fidelity implementation. It must use the approved clean clinical direction, system icons and no-custom-asset MVP boundary unless a separate design decision approves a change.

## Approval and implementation

- Claude presents the proposal and waits for explicit approval or documented changes before implementing the affected UI.
- It may create proposal documentation only; it must not silently make high-fidelity product/design decisions in code.
- Approved proposal details become task documentation and, when material, update the design specification/decision log through the documentation process.
- If the proposed design conflicts with any accepted requirement/ADR or reveals an ambiguity, Claude raises a decision-change request instead of selecting a convenient design.

The required first design deliverable is the [initial Claude design-review brief](initial-claude-design-review-brief.md), using the [Claude Design agent brief](claude-design-agent-brief.md) and its proposal workspace.
