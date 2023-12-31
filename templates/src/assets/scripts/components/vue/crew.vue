<template>
    <div>
      <ul>
        <li v-for="Crewmember in crewData" :key="Crewmember.id">
          <img :src="Crewmember.image" :alt="Crewmember.name" class="crew-member-image">
          <h2>{{ Crewmember.name }}</h2>
          <p>{{ Crewmember.duties }}</p>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
  props: ['initialData'],
  data() {
    return {
      crewData: this.initialData || [], // Use the initialData prop
    };
  },
  mounted() {
    console.log("deez nuts"); // Log the crewData to the console
    console.log(this.crewData); // Log the crewData to the console
  },
};
</script>


<style>
.crew-members-container {
    width: 100px;
    height: 100px;
}
.crew-members-container img {
    width: 100px;
    height: 100px;
}
</style>