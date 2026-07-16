const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secure_pump_control_jwt_secret_key_2026_xyz';

function handleGetStatus(req, res, next) {
  try {
    const userCountRow = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const isResetMode = process.env.RESET_ADMIN === 'true';
    const setupRequired = userCountRow.count === 0 || isResetMode;
    return res.status(200).json({ success: true, setupRequired });
  } catch (error) {
    return next(error);
  }
}

function handleSetup(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields (username, email, password) are required.' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const userCountRow = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const isResetMode = process.env.RESET_ADMIN === 'true';

    if (userCountRow.count > 0 && !isResetMode) {
      return res.status(400).json({ success: false, message: 'Setup is already complete and permanently disabled.' });
    }

    // If reset mode is active and user exists, wipe existing user first
    if (isResetMode && userCountRow.count > 0) {
      db.prepare('DELETE FROM users').run();
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    db.prepare(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, 'admin')
    `).run(username.trim(), email.trim().toLowerCase(), passwordHash);

    return res.status(201).json({
      success: true,
      message: 'Root administrator account configured successfully.'
    });
  } catch (error) {
    return next(error);
  }
}

function handleLogin(req, res, next) {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: 'Username/Email and Password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(
      usernameOrEmail.trim(),
      usernameOrEmail.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username/email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username/email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return next(error);
  }
}

function handleUpdateSettings(req, res, next) {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    if (!username || !email) {
      return res.status(400).json({ success: false, message: 'Username and email are required.' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long.' });
    }

    // Check if username/email is taken by another user
    const duplicateUser = db.prepare('SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?').get(
      username.trim(),
      email.trim().toLowerCase(),
      req.user.id
    );

    if (duplicateUser) {
      return res.status(400).json({ success: false, message: 'Username or email is already in use.' });
    }

    let passwordHashToUpdate = null;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to change password.' });
      }

      const dbUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
      if (!dbUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const isMatch = bcrypt.compareSync(currentPassword, dbUser.password_hash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      }

      const salt = bcrypt.genSaltSync(10);
      passwordHashToUpdate = bcrypt.hashSync(newPassword, salt);
    }

    if (passwordHashToUpdate) {
      db.prepare(`
        UPDATE users
        SET username = ?, email = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(username.trim(), email.trim().toLowerCase(), passwordHashToUpdate, req.user.id);
    } else {
      db.prepare(`
        UPDATE users
        SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(username.trim(), email.trim().toLowerCase(), req.user.id);
    }

    const newToken = jwt.sign(
      { id: req.user.id, username: username.trim(), email: email.trim().toLowerCase() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      token: newToken,
      user: {
        username: username.trim(),
        email: email.trim().toLowerCase()
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  handleGetStatus,
  handleSetup,
  handleLogin,
  handleUpdateSettings
};
