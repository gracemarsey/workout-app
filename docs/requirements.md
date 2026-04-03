## Overview

I want a workout app that is personalised to my goals of building overall strength so I can start running again. I want the options of being able to do workouts at home, or in a gym. I want a mixture of upper, lower and full body strength exercises as well as cardio. These workouts should take no longer than 45 minutes, including a warm up and cool down. My aim is to do three workouts a week, one upper body focused, one lower body focused then one on full body strength/cardio focused. 

## Exercise Data Source

This app uses the [free-exercise-db](https://github.com/yuhonas/free-exercise-db) open-source exercise database, included locally at `/free-exercise-db/`. This provides:

- **873 total exercises** with full metadata
- **Equipment types**: barbell, dumbbell, body only, bands, kettlebells, cable, machine, e-z curl bar, exercise ball, medicine ball
- **Muscle groups**: chest, back (lats, middle back), shoulders, biceps, triceps, quadriceps, hamstrings, glutes, calves, abdominals, forearms
- **Exercise metadata**: force type (push/pull/static), difficulty level (beginner/intermediate/expert), mechanic (compound/isolation)
- **Instructions**: Step-by-step exercise instructions
- **Images**: Exercise demonstration images available at:
  - `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{exercise_id}/{image_index}.jpg`

### Home vs Gym Equipment Mapping

| Location | Available Equipment |
|----------|---------------------|
| **Home** | body only, dumbbell, bands, kettlebells, exercise ball, medicine ball (~336 exercises) |
| **Gym** | All equipment including barbell, cable, machine, e-z curl bar (~449 additional exercises) |

## Home tab 

This would welcome me to the app and suggest a type of workout based on what I have done previously that week. For instance, if I have already logged an upper body workout that week, then suggest either a lower or full body workout. The home screen should also have a progress tracker in saying how many of the three workouts I have done that week. Clicking on the suggested workout should take me to the relevant workout screen.

## Workouts tab

I want three sections upper, lower and full body. Clicking into any of them should take me to a generated workout relevant to that section. I want to be able to choose whether this is a home. or gym workout. If a home workout the equipment used should be limited to bands and dumbells. If in a gym, you should suggest any equipment you would typically find in an average gym. At the top of each workout there should be a progress bar in % tracking how far into this workout I am. I also want a start button at the top to track time of overall workout in minutes. I should also beb able to pause.

Each exercise should tell me how many reps and weight I should use. I should be able to edit both fields. I should be able to mark an exercise as complete. Once all exercises are complete, mark the workout as complete and this will count towards the weekly total. This total should reset each week. Once a workout is complete, stop the timer. A week runs from Monday to Sunday. Every 4 weeks the exercises should increase in difficulty based on the rep count and weight I have been using previously. 

I would like a short demonstration video of how to perform each exercise within the exercise tab.

I want there to be variation week on week within the workouts. Do not suggest the exact same workouts each time. Feel free to change equipment. 

I want to be able to dismiss an exercise type from that workout if it is not suitable, or the equipment isn't available. The app should ask me why I am dismissing it with a dropdown option of either I don't feel like it or this equipement isn't available. If I have chosen I don't feel like it, then keep this exercise in rotation for a future workout. If I have chosen I don't feel like it make sure not to suggest this equipement type again. 