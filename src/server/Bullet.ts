/**
 * This class stores the state of a bullet on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from '../lib/Constants.js'
import Entity from '../lib/Entity.js'
import Player from './Player.js'
import Vector from '../lib/Vector.js'

class Bullet extends Entity {
  angle: number
  source: Player

  damage: number
  distanceTraveled: number
  destroyed: boolean

  constructor(position: Vector, velocity: Vector, angle: number,
              source: Player) {
    super(position, velocity, Vector.zero(), Constants.BULLET_HITBOX_SIZE)

    this.angle = angle
    this.source = source

    this.damage = Constants.BULLET_DEFAULT_DAMAGE
    this.distanceTraveled = 0
    this.destroyed = false
  }

  /**
   * Creates a new Bullet object from a Player object firing it.
   * @param {Player} player The Player object firing the bullet
   * @param {number} [angleDeviation=0] The angle deviation if the bullet is
   *   not traveling in the direction of the turret
   */
  static createFromPlayer(player: Player, angleDeviation = 0) {
    const angle = player.turretAngle + angleDeviation
    return new Bullet(
      player.position.copy(),
      Vector.fromPolar(Constants.BULLET_SPEED, angle),
      angle,
      player,
    )
  }

  /**
   * Performs a physics update.
   * @param {number} _lastUpdateTime The last timestamp an update occurred,
   * unused
   * @param {number} deltaTime The timestep to compute the update with
   */
  update(_lastUpdateTime: number, deltaTime: number) {
    const distanceStep = Vector.scale(this.velocity, deltaTime)
    this.position.add(distanceStep)
    this.distanceTraveled += distanceStep.mag2
    if (this.inWorld() ||
      this.distanceTraveled > Constants.BULLET_MAX_TRAVEL_DISTANCE_SQ) {
      this.destroyed = true
    }
  }
}

export default Bullet
