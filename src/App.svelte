<script lang="ts">
  import { dndzone } from 'svelte-dnd-action'
  import { flip } from 'svelte/animate'
  import { Svrollbar } from 'svrollbar'

  import {
    steps,
    type NewStep,
    addStep,
    updateStep,
    doReplace,
    removeStep,
    exportSteps,
    importSteps,
    clearSteps,
  } from './steps'

  import StepCard from './StepCard.svelte'
  import { copy, paste } from './lib'

  let showAddStep = false
  let userInput: string
  let output: string

  export let viewport: Element
  export let contents: Element

  $: replaceDisabled = !(userInput && $steps.length > 0)
  $: dragDisabled = !($steps.length > 0)

  let handleAddStep = (step: NewStep) => {
    addStep(step)
    showAddStep = false
  }

  let handleReplace = () => {
    output = doReplace(userInput, $steps)
  }

  let handlePaste = () => {
    paste().then((res) => {
      if (res) userInput = res
    })
  }

  let handleDndConsider = (e: any) => {
    steps.set(e.detail.items)
  }

  let handleDndFinalize = (e: any) => {
    steps.set(e.detail.items)
  }
</script>

<div class="navbar fixed bg-base-100 border-b border-b-base-300 z-10 px-12">
  <div class="flex-1">
    <h1 class="text-xl font-semibold">replacer</h1>
  </div>
  <div class="flex-none">
    <button class="btn btn-ghost btn-sm" on:click={importSteps}>
      <span>Import</span>
    </button>
    <button class="btn btn-ghost btn-sm ml-2" on:click={exportSteps}>
      <span>Export</span>
    </button>
  </div>
</div>

<div class="container mx-auto h-screen pt-20">
  <div
    class="max-h-full grid md:grid-cols-3 md:gap-x-5 sm:grid-cols-1 sm:gap-y-5"
  >
    <div class="px-1">
      <h2 class="text-lg font-semibold">Input</h2>
      <div class="form-control mt-2 relative">
        <button
          class="btn btn-xs absolute -top-7 right-0 btn-ghost"
          on:click={handlePaste}
        >
          <span>Paste</span>
        </button>
        <textarea
          bind:value={userInput}
          id="input"
          class="textarea textarea-bordered resize-none font-mono text-xs"
          placeholder="Input some text here..."
          rows={24}
        />
      </div>
    </div>

    <div
      class="px-1 grid grid-cols-1 grid-flow-row auto-rows-max gap-y-2 max-h-full relative"
    >
      <button
        class="btn btn-xs absolute top-2 right-1 btn-ghost"
        on:click={clearSteps}
      >
        <span>Clear</span>
      </button>
      <h2 class="text-lg font-semibold">Steps</h2>
      <div class="relative">
        <div
          bind:this={viewport}
          id="viewport"
          class="w-full h-[25rem] border border-neutral border-opacity-20 relative"
        >
          <div
            bind:this={contents}
            class="grid grid-cols-1 px-3 py-2 gap-y-2"
            use:dndzone={{
              items: $steps,
              dragDisabled,
              flipDurationMs: 300,
              dropTargetStyle: {},
            }}
            on:consider={handleDndConsider}
            on:finalize={handleDndFinalize}
          >
            {#each $steps as step, idx (step.id)}
              <div animate:flip={{ duration: 300 }}>
                <StepCard
                  {idx}
                  {step}
                  on:save={(e) => updateStep(idx, e.detail)}
                  on:remove={() => removeStep(idx)}
                />
              </div>
            {:else}
              <div
                class="absolute right-0 top-0 w-full h-full flex flex-col justify-center items-center opacity-80"
              >
                <span class="text-xl font-semibold">No steps...</span>
                <br />
                <span class="">Click "Add Step" button to add a step</span>
              </div>
            {/each}
            {#if showAddStep}
              <StepCard
                on:save={(e) => handleAddStep(e.detail)}
                on:cancel={() => (showAddStep = false)}
              />
            {/if}
          </div>
        </div>
        <Svrollbar {viewport} {contents} />
      </div>
      <div class="grid grid-cols-2 gap-2">
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
      <div class="form-control mt-2 relative">
        <button
          class="btn btn-xs absolute -top-7 right-0 btn-ghost"
          on:click={() => copy(output)}
          disabled={!output}
        >
          <span>Copy</span>
        </button>
        <textarea
          bind:value={output}
          id="output"
          class="textarea textarea-bordered resize-none font-mono text-xs"
          placeholder="And output goes here..."
          readonly
          rows={24}
        />
      </div>
    </div>
  </div>
</div>

<style>
  #viewport {
    overflow: scroll;
    box-sizing: border-box;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  #viewport::-webkit-scrollbar {
    display: none;
  }
</style>
