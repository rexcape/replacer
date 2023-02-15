<script lang="ts">
  import {
    steps,
    type NewStep,
    addStep,
    updateStep,
    doReplace,
    removeStep,
    exportSteps,
    importSteps,
  } from './steps'

  import StepCard from './StepCard.svelte'

  let showAddStep = false
  let userInput: string
  let output: string

  $: replaceDisabled = !(userInput && $steps.length > 0)

  let handleAddStep = (step: NewStep) => {
    addStep(step)
    showAddStep = false
  }

  let handleReplace = () => {
    output = doReplace(userInput, $steps)
  }
</script>

<div class="container mx-auto h-screen">
  <div class="navbar">
    <div class="flex-1">
      <h1 class="text-xl font-semibold">replacer</h1>
    </div>

    <div class="flex-none">
      <button class="btn btn-ghost" on:click={importSteps}>Import</button>
    </div>
    <div class="flex-none">
      <button class="btn btn-ghost" on:click={exportSteps}>Export</button>
    </div>
  </div>

  <div class="h-full grid md:grid-cols-3 md:gap-x-5 sm:grid-cols-1 sm:gap-y-5">
    <div class="px-1">
      <h2 class="text-lg font-semibold">Input</h2>
      <div class="form-control mt-2">
        <textarea
          bind:value={userInput}
          id="input"
          class="textarea textarea-bordered resize-none font-mono"
          placeholder="Input some text here..."
          rows={10}
        />
      </div>
    </div>

    <div class="px-1">
      <h2 class="text-lg font-semibold">Steps</h2>
      <div class="mt-2 grid grid-cols-1 gap-y-2">
        {#each $steps as step, idx}
          <StepCard
            {idx}
            {step}
            on:save={(e) => updateStep(idx, e.detail)}
            on:remove={() => removeStep(idx)}
          />
        {/each}
        {#if showAddStep}
          <StepCard on:save={(e) => handleAddStep(e.detail)} />
        {/if}
        {#if showAddStep}
          <button
            class="btn btn-primary"
            on:click={() => (showAddStep = false)}
          >
            <span>Cancel</span>
          </button>
        {:else}
          <button class="btn btn-primary" on:click={() => (showAddStep = true)}>
            <span>Add Step</span>
          </button>
        {/if}
      </div>
      <div class="mt-5">
        <button
          class="btn btn-primary"
          disabled={replaceDisabled}
          on:click={handleReplace}
        >
          <span>Replace</span>
        </button>
      </div>
    </div>

    <div class="px-1">
      <h2 class="text-lg font-semibold">Output</h2>
      <div class="form-control mt-2">
        <textarea
          bind:value={output}
          id="output"
          class="textarea textarea-bordered resize-none font-mono"
          placeholder="And output goes here..."
          readonly
          rows={10}
        />
      </div>
    </div>
  </div>
</div>
