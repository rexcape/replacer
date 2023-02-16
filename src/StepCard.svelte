<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import type { NewStep, Step } from './steps'
  import { format } from './lib'

  const dispatch = createEventDispatcher()

  const defaultNewStep = {
    pat: '',
    out: '',
    type: 'text',
    isRegex: false,
    enabled: true,
  } as NewStep

  export let step: Step | NewStep = undefined
  export let idx: number = undefined

  let editing = false
  let formData: Step | NewStep

  let edit = () => {
    editing = true
  }

  let save = () => {
    dispatch('save', formData)
    editing = false
  }

  let remove = () => {
    dispatch('remove')
  }

  onMount(() => {
    if (idx !== undefined) {
      formData = { ...step }
    } else {
      editing = true
      formData = { ...defaultNewStep }
    }
  })
  $: ({ enabled, type, isRegex, pat, out } = step ?? defaultNewStep)
  $: saveDisabled = !(formData?.pat && formData?.out)

  let handleCancel = () => {
    editing = false
    dispatch('cancel')
  }

  let handleFormat = () => {
    formData.out = format(formData.out)
  }
</script>

<div class="card card-bordered card-compact shadow-sm">
  <div class="card-body">
    {#if editing}
      <div>
        <div class="grid gap-4 grid-cols-3">
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Enabled</span>
              <input
                bind:checked={formData.enabled}
                class="checkbox checkbox-xs"
                type="checkbox"
              />
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">RegExp</span>
              <input
                bind:checked={formData.isRegex}
                class="checkbox checkbox-xs"
                type="checkbox"
              />
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">IsFunc</span>
              <input
                class="checkbox checkbox-xs"
                type="checkbox"
                checked={formData.type === 'func'}
                on:input={(e) => {
                  if (e.currentTarget.checked) {
                    formData.type = 'func'
                  } else {
                    formData.type = 'text'
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div class="form-control w-full">
          <label class="label" for="pat">
            <span class="label-text">Pattern</span>
          </label>
          <input
            bind:value={formData.pat}
            id="pat"
            class="input input-bordered input-xs w-full"
            placeholder="Input pattern here"
          />
        </div>

        <div class="form-control w-full">
          <label class="label" for="out">
            <span class="label-text">Output</span>
          </label>
          <input
            bind:value={formData.out}
            id="out"
            class="input input-bordered input-xs w-full"
            placeholder="Output text here"
          />
        </div>
      </div>
    {:else}
      <h2 class="card-title text-sm font-semibold">
        <input class="checkbox checkbox-xs" type="checkbox" checked={enabled} />
        Step {idx + 1}
        <span class="badge">pattern:{isRegex ? 'regex' : 'string'}</span>
        <span class="badge">replace:{type}</span>
      </h2>
      <div>
        Replace <span class="bg-base-200">{pat}</span><br />
        With <span class="bg-base-200">{out}</span>
      </div>
    {/if}
    <div class="card-actions justify-end">
      <button class="btn btn-ghost btn-warning btn-xs" on:click={remove}>
        <span>Remove</span>
      </button>
      {#if editing}
        <button
          class="btn btn-ghost btn-xs"
          on:click={save}
          disabled={saveDisabled}
        >
          <span>Save</span>
        </button>
      {:else}
        <button class="btn btn-ghost btn-xs" on:click={edit}>
          <span>Edit</span>
        </button>
      {/if}
    </div>
  </div>
</div>

{#if editing}
  <div class="modal modal-open ">
    <div class="modal-box relative md:w-11/12 lg:w-2/3 max-w-5xl grid grid-cols-1 gap-y-2">
      <button
        class="btn btn-square btn-bordered btn-sm absolute right-6 top-6"
        on:click={handleCancel}
      >
        <span>X</span>
      </button>

      <h3 class="text-lg font-semibold">Edit step</h3>

      <div class="grid gap-4 grid-cols-3">
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">IsEnabled</span>
            <input
              bind:checked={formData.enabled}
              class="toggle"
              type="checkbox"
            />
          </label>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">IsRegularExpression</span>
            <input
              bind:checked={formData.isRegex}
              class="toggle"
              type="checkbox"
            />
          </label>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">IsFunctionReplacer</span>
            <input
              class="toggle"
              type="checkbox"
              checked={formData.type === 'func'}
              on:input={(e) => {
                if (e.currentTarget.checked) {
                  formData.type = 'func'
                } else {
                  formData.type = 'text'
                }
              }}
            />
          </label>
        </div>
      </div>
      <div class="form-control w-full">
        <label class="label" for="pat">
          <span class="label-text">Pattern</span>
        </label>
        <textarea
          bind:value={formData.pat}
          id="pat"
          class="textarea textarea-bordered textarea-sm font-mono text-sm resize-none w-full"
          placeholder="Input pattern here"
          rows={3}
        />
      </div>

      <div class="form-control w-full relative">
        {#if formData.type === 'func'}
          <button
            class="btn btn-xs btn-ghost absolute top-2 right-0"
            on:click={handleFormat}
            disabled={!formData.out}
          >
            <span>Format</span>
          </button>
        {/if}
        <label class="label" for="out">
          <span class="label-text">Output</span>
        </label>
        <textarea
          bind:value={formData.out}
          id="out"
          class="textarea textarea-bordered textarea-sm font-mono text-sm resize-none w-full"
          placeholder="Output text here"
          rows={8}
        />
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost btn-sm" on:click={handleCancel}>
          <span>Cancel</span>
        </button>
        <button
          class="btn btn-ghost btn-sm"
          on:click={save}
          disabled={saveDisabled}
        >
          <span>Save</span>
        </button>
      </div>
    </div>
  </div>
{/if}
