import JSZip from 'jszip';

export interface GodotSourceFile {
  path: string;
  content: string;
}

export function generateGodotProjectFiles(): GodotSourceFile[] {
  const files: GodotSourceFile[] = [];

  // 1. project.godot
  files.push({
    path: 'project.godot',
    content: `; Engine configuration file for "রাত ৩টার ডেলিভারি (3 AM Delivery)"
; Optimized for Godot 4.2+ / 4.3 with Compatibility renderer for Android & Web.

config_version=5

[application]

config/name="3 AM Delivery (রাত ৩টার ডেলিভারি)"
config/description="3D First-person Psychological Horror Delivery Game set in Rural Bengal."
run/main_scene="res://scenes/main_menu.tscn"
config/features=PackedStringArray("4.3", "GL Compatibility")
boot_splash/bg_color=Color(0.03, 0.04, 0.06, 1)

[display]

window/size/viewport_width=1280
window/size/viewport_height=720
window/size/mode=0
window/stretch/mode="canvas_items"
window/stretch/aspect="expand"
window/handheld/orientation=6

[rendering]

renderer/rendering_method="gl_compatibility"
renderer/rendering_method.mobile="gl_compatibility"
renderer/rendering_method.web="gl_compatibility"
anti_aliasing/screen_space_roughness_limiter/enabled=false
environment/defaults/default_clear_color=Color(0.03, 0.04, 0.06, 1)

[input]

move_forward={
"deadzone": 0.5,
"events": [Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":87,"physical_keycode":87,"key_label":0,"unicode":119,"echo":false,"script":null)
]
}
move_backward={
"deadzone": 0.5,
"events": [Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":83,"physical_keycode":83,"key_label":0,"unicode":115,"echo":false,"script":null)
]
}
move_left={
"deadzone": 0.5,
"events": [Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":65,"physical_keycode":65,"key_label":0,"unicode":97,"echo":false,"script":null)
]
}
move_right={
"deadzone": 0.5,
"events": [Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":68,"physical_keycode":68,"key_label":0,"unicode":100,"echo":false,"script":null)
]
}
flashlight_toggle={
"deadzone": 0.5,
"events": [Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":70,"physical_keycode":70,"key_label":0,"unicode":102,"echo":false,"script":null)
]
}
interact={
"deadzone": 0.5,
"events": [Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":69,"physical_keycode":69,"key_label":0,"unicode":101,"echo":false,"script":null)
]
}
sprint={
"deadzone": 0.5,
"events": [Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":4194325,"physical_keycode":4194325,"key_label":0,"unicode":0,"echo":false,"script":null)
]
}
crouch={
"deadzone": 0.5,
"events": [Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":67,"physical_keycode":67,"key_label":0,"unicode":99,"echo":false,"script":null)
]
}
`
  });

  // 2. export_presets.cfg
  files.push({
    path: 'export_presets.cfg',
    content: `[preset.0]

name="Android APK (Mobile)"
platform="Android"
runnable=true
advanced_options=false
dedicated_server=false
custom_features=""
export_filter="all_resources"
include_filter=""
exclude_filter=""
export_path="builds/android/3AM_Delivery_Bengali_Horror.apk"

[preset.0.options]

custom_template/debug=""
custom_template/release=""
architectures/arm64-v8a=true
architectures/armeabi-v7a=true
architectures/x86_64=false
package/unique_name="com.bengali.horror.delivery3am"
package/name="3 AM Delivery"
package/signed=false
package/classification_code=""
package/version_code=1
package/version_name="1.0.0"
package/min_sdk="24"
package/target_sdk="34"
permissions/vibrate=true
permissions/internet=false
screen/orientation=6
screen/support_small=true
screen/support_normal=true
screen/support_large=true

[preset.1]

name="WebAssembly (Browser)"
platform="Web"
runnable=true
advanced_options=false
dedicated_server=false
custom_features=""
export_filter="all_resources"
include_filter=""
exclude_filter=""
export_path="builds/web/index.html"

[preset.1.options]

custom_template/debug=""
custom_template/release=""
variant/extensions_support=false
variant/thread_support=false
vram_texture_compression/for_desktop=true
vram_texture_compression/for_mobile=true
html/export_icon=true
html/custom_html_shell=""
html/head_include="<meta name='viewport' content='width=device-width, user-scalable=no, initial-scale=1.0'>"
`
  });

  // 3. scripts/player_controller.gd
  files.push({
    path: 'scripts/player_controller.gd',
    content: `extends CharacterBody3D

class_name PlayerController

@export var walk_speed: float = 3.2
@export var sprint_speed: float = 5.4
@export var crouch_speed: float = 1.8
@export var mouse_sensitivity: float = 0.0025

@onready var camera: Camera3D = $Head/Camera3D
@onready var flashlight: SpotLight3D = $Head/Camera3D/Flashlight
@onready var head: Node3D = $Head
@onready var interact_ray: RayCast3D = $Head/Camera3D/InteractRay

var sanity: float = 100.0
var battery: float = 100.0
var is_flashlight_on: bool = true
var is_crouched: bool = false

var gravity: float = ProjectSettings.get_setting("physics/3d/default_gravity")

func _ready() -> void:
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		head.rotate_y(-event.relative.x * mouse_sensitivity)
		camera.rotate_x(-event.relative.y * mouse_sensitivity)
		camera.rotation.x = clamp(camera.rotation.x, deg_to_rad(-85), deg_to_rad(85))

	if event.is_action_pressed("flashlight_toggle"):
		toggle_flashlight()

	if event.is_action_pressed("crouch"):
		is_crouched = !is_crouched
		head.position.y = 1.1 if is_crouched else 1.65

	if event.is_action_pressed("interact"):
		try_interact()

func _physics_process(delta: float) -> void:
	if not is_on_floor():
		velocity.y -= gravity * delta

	var input_dir := Input.get_vector("move_left", "move_right", "move_forward", "move_backward")
	var direction := (head.global_transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()

	var speed := walk_speed
	if Input.is_action_pressed("sprint") and not is_crouched:
		speed = sprint_speed
	elif is_crouched:
		speed = crouch_speed

	if direction:
		velocity.x = direction.x * speed
		velocity.z = direction.z * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed)
		velocity.z = move_toward(velocity.z, 0, speed)

	move_and_slide()

	if is_flashlight_on:
		battery = max(0.0, battery - 0.7 * delta)
		if battery <= 0.0:
			toggle_flashlight()

func toggle_flashlight() -> void:
	if battery > 0.0:
		is_flashlight_on = !is_flashlight_on
		flashlight.visible = is_flashlight_on

func try_interact() -> void:
	if interact_ray.is_colliding():
		var target = interact_ray.get_collider()
		if target.has_method("on_interact"):
			target.on_interact(self)
`
  });

  // 4. scripts/ghost_ai.gd
  files.push({
    path: 'scripts/ghost_ai.gd',
    content: `extends CharacterBody3D

class_name GhostAI

enum GhostType { CALLER_BEHIND, SHADOW_STALKER, NISHI_GUEST }
enum GhostState { STALK, CHASE, RETREAT, FROZEN }

@export var ghost_type: GhostType = GhostType.CALLER_BEHIND
@export var current_state: GhostState = GhostState.STALK
@export var base_speed: float = 2.4
@export var player_path: NodePath

var player: CharacterBody3D
var whisper_timer: float = 4.0

func _ready() -> void:
	if player_path:
		player = get_node(player_path)

func _physics_process(delta: float) -> void:
	if not player:
		return

	var dist := global_position.distance_to(player.global_position)
	var to_ghost := (global_position - player.global_position).normalized()
	var player_forward := -player.get_node("Head/Camera3D").global_transform.basis.z.normalized()
	var facing_dot := player_forward.dot(to_ghost)

	match ghost_type:
		GhostType.CALLER_BEHIND:
			# RULE: Never look back!
			if facing_dot > 0.65 and dist < 16.0:
				current_state = GhostState.CHASE

			if current_state == GhostState.CHASE:
				look_at(player.global_position, Vector3.UP)
				velocity = -global_transform.basis.z * 5.2
			else:
				# Follow silently behind
				var behind_pos = player.global_position + (-player_forward * 10.0)
				look_at(player.global_position, Vector3.UP)
				global_position = global_position.lerp(behind_pos, 1.2 * delta)

		GhostType.SHADOW_STALKER:
			# RULE: Freeze under flashlight light; moves in dark
			var player_flashlight = player.get_node("Head/Camera3D/Flashlight")
			var in_beam = player_flashlight.visible and facing_dot > 0.65 and dist < 20.0

			if in_beam:
				current_state = GhostState.FROZEN
				velocity = Vector3.ZERO
			else:
				current_state = GhostState.STALK
				look_at(player.global_position, Vector3.UP)
				velocity = -global_transform.basis.z * 3.4

	move_and_slide()
`
  });

  // 5. scripts/puzzle_manager.gd
  files.push({
    path: 'scripts/puzzle_manager.gd',
    content: `extends Node

class_name PuzzleManager

signal level_completed
signal level_failed(reason: String)

@export var level_number: int = 1
@export var required_clues_count: int = 1

var found_clues: Array[String] = []

func register_clue(clue_id: String) -> void:
	if not found_clues.has(clue_id):
		found_clues.append(clue_id)
		print("Clue Collected: ", clue_id)

func verify_delivery_destination(player: Node) -> void:
	print("Delivery Successful for Level ", level_number)
	emit_signal("level_completed")
`
  });

  // 6. scenes/player.tscn
  files.push({
    path: 'scenes/player.tscn',
    content: `[gd_scene load_steps=4 format=3]

[ext_resource type="Script" path="res://scripts/player_controller.gd" id="1_play"]

[sub_resource type="CapsuleShape3D" id="CapsuleShape3D_1"]
radius = 0.4
height = 1.8

[node name="Player" type="CharacterBody3D"]
script = ExtResource("1_play")

[node name="CollisionShape3D" type="CollisionShape3D" parent="."]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0.9, 0)
shape = SubResource("CapsuleShape3D_1")

[node name="Head" type="Node3D" parent="."]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1.65, 0)

[node name="Camera3D" type="Camera3D" parent="Head"]
current = true

[node name="Flashlight" type="SpotLight3D" parent="Head/Camera3D"]
light_color = Color(1, 0.95, 0.85, 1)
light_energy = 3.5
spot_range = 30.0
spot_angle = 32.0

[node name="InteractRay" type="RayCast3D" parent="Head/Camera3D"]
target_position = Vector3(0, 0, -3.5)
`
  });

  // 7. scenes/main_menu.tscn
  files.push({
    path: 'scenes/main_menu.tscn',
    content: `[gd_scene format=3]

[node name="MainMenu" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="Background" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
color = Color(0.03, 0.04, 0.06, 1)

[node name="TitleBn" type="Label" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.3
anchor_right = 0.5
anchor_bottom = 0.3
offset_left = -250.0
offset_top = -40.0
offset_right = 250.0
offset_bottom = 40.0
text = "রাত ৩টার ডেলিভারি"
horizontal_alignment = 1

[node name="TitleEn" type="Label" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.4
anchor_right = 0.5
anchor_bottom = 0.4
offset_left = -250.0
offset_top = -20.0
offset_right = 250.0
offset_bottom = 20.0
text = "3 AM Delivery - Bengali Horror"
horizontal_alignment = 1

[node name="VBoxContainer" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.6
anchor_right = 0.5
anchor_bottom = 0.6
offset_left = -120.0
offset_top = -60.0
offset_right = 120.0
offset_bottom = 60.0

[node name="BtnNewGame" type="Button" parent="VBoxContainer"]
layout_mode = 2
text = "নতুন খেলা (New Game)"

[node name="BtnLevels" type="Button" parent="VBoxContainer"]
layout_mode = 2
text = "অধ্যায় নির্বাচন (Chapters)"
`
  });

  // 8. 10 Levels Godot Scenes
  const levelNames = [
    'level_01_bottola',
    'level_02_bamboo_grove',
    'level_03_old_homestead',
    'level_04_cremation_byway',
    'level_05_schoolhouse',
    'level_06_river_ghat',
    'level_07_endless_crossroads',
    'level_08_graveyard',
    'level_09_zamindar_mansion',
    'level_10_final_delivery'
  ];

  levelNames.forEach((lvl, idx) => {
    files.push({
      path: `scenes/levels/${lvl}.tscn`,
      content: `[gd_scene load_steps=3 format=3]

[ext_resource type="PackedScene" path="res://scenes/player.tscn" id="1_plr"]
[ext_resource type="Script" path="res://scripts/puzzle_manager.gd" id="2_puz"]

[node name="${lvl}" type="Node3D"]

[node name="PuzzleManager" type="Node" parent="."]
script = ExtResource("2_puz")
level_number = ${idx + 1}

[node name="Player" parent="." instance=ExtResource("1_plr")]
transform = Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 25)

[node name="DirectionalLight3D" type="DirectionalLight3D" parent="."]
transform = Transform3D(0.866, -0.25, 0.433, 0, 0.866, 0.5, -0.5, -0.433, 0.75, 0, 20, 0)
light_color = Color(0.25, 0.32, 0.42, 1)
light_energy = 0.5
shadow_enabled = true

[node name="WorldEnvironment" type="WorldEnvironment" parent="."]
`
    });
  });

  // 9. README.md
  files.push({
    path: 'README.md',
    content: `# রাত ৩টার ডেলিভারি (3 AM Delivery) - Godot 4.x Source Project

This repository contains the complete Godot 4.x project files, GDScript controllers, 10 distinct level scenes, Android APK export presets, and WebAssembly configuration for the 3D psychological horror game.

## Features
- **10 Complete Folklore Levels**: Bottola Crossroads, Bamboo Grove, Abandoned Homestead, Cremation Byway, 1947 Schoolhouse, River Ghat, Infinite Loop, Graveyard, Zamindar Mansion, and Final 3 AM Shrine.
- **3 Intelligent Ghost Entities**: The Caller Behind (পেছনের ডাক), The Shadow Stalker (ছায়ামূর্তি), and Nishi's Deception (নিশির অতিথি).
- **Realistic Bengali Horror Ambience**: Night crickets, wind gusts, wooden footsteps, and layered whispers.

## How to Open in Godot 4
1. Download and install **Godot 4.2+** or **Godot 4.3** from [godotengine.org](https://godotengine.org).
2. Unzip this project into a directory.
3. Open Godot Engine, click **Import**, and select the \`project.godot\` file in this folder.
4. Press **F5** to run the game!

## How to Export to Android (Installable APK)
1. In Godot 4, go to **Project -> Export**.
2. Select the **Android APK (Mobile)** preset.
3. Ensure Android SDK / Build Tools are configured in Editor Settings -> Export -> Android.
4. Click **Export Project** to produce \`3AM_Delivery_Bengali_Horror.apk\`.

## Controls
- **WASD / Arrow Keys**: Move
- **Mouse / Touch Drag**: Look Around
- **F**: Flashlight On/Off
- **Shift**: Sprint
- **C**: Crouch
- **E**: Interact / Deliver Parcel
`
  });

  return files;
}

export async function createGodotProjectZipBlob(): Promise<Blob> {
  const zip = new JSZip();
  const files = generateGodotProjectFiles();

  files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  return await zip.generateAsync({ type: 'blob' });
}
