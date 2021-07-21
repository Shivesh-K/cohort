<script>
    export let label;
    export let placeholder;
    export let type;
    export let value;
    export let error;
    const field = label.toLowerCase();

    const onChange = (ev) => {
        value = ev.target.value;
    };
</script>

<div class="flex flex-col gap-2 m-2">
    <label
        for={field}
        class="ml-2 text-indigo-700 text-md font-body font-semibold"
    >
        {label}
    </label>
    <input
        id={field}
        {type}
        {value}
        {placeholder}
        on:change={onChange}
        class="h-12 p-2 rounded-md bg-indigo-50 outline-none border-2 border-indigo-50 focus:border-indigo-700"
    />
    {#if error}
        <p class="ml-2 text-red-600 italic text-sm font-semibold">{error}</p>
    {/if}
</div>
