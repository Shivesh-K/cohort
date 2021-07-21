<style global>
  @import "tailwindcss/base";

  @import "tailwindcss/components";

  @import "tailwindcss/utilities";

  .btn {
    @apply rounded-md 
    my-1 mx-1 py-2 px-4 
    font-head font-semibold 
    hover:no-underline 
    disabled:opacity-75
    tracking-wider transition-all duration-150;
  }

  .btn-primary {
    @apply btn 
    bg-indigo-600 text-white 
    shadow-xl 
    hover:shadow-2xl 
    hover:bg-indigo-700 
    hover:text-white;
  }

  .btn-secondary {
    @apply btn 
    bg-indigo-100 text-indigo-700 
    hover:bg-indigo-200 
    hover:text-indigo-800;
  }

  .card {
    @apply shadow-md rounded-lg p-4 m-2;
  }
</style>
